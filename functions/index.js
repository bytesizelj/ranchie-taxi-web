const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");
const twilio = require("twilio");

const TWILIO_ACCOUNT_SID = defineSecret("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = defineSecret("TWILIO_AUTH_TOKEN");

// Twilio SMS config
const TWILIO_FROM = "+15674853767";
const SMS_RECIPIENTS = ["+17844932354", "+17844977245"]; // Ranchie (primary), LJ (backup)

// Customer number to E.164. Returns null for anything unusable - never throws,
// so a malformed phone can never interrupt Ranchie's own notifications.
const toE164 = (raw) => {
  if (!raw || raw === "Not provided") return null;
  const digits = String(raw).replace(/[^0-9]/g, "");
  if (digits.length === 7) return `+1784${digits}`; // SVG local
  if (digits.length === 10 && digits.startsWith("784")) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return `+${digits}`; // international as typed
  return null;
};

initializeApp();

exports.sendBookingNotification = onDocumentCreated(
  {
    document: "bookings/{bookingId}",
    secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN],
  },
  async (event) => {
  const booking = event.data.data();

  // Bookings entered by Ranchie in the dashboard need no alert back to Ranchie.
  if (booking.createdBy === "driver") {
    console.log(`Driver-created booking ${event.params.bookingId} - notifications skipped`);
    return;
  }

  const db = getFirestore();
  const messaging = getMessaging();

  // --- SMS notification (reliable channel, runs regardless of FCM) ---
  try {
    const smsClient = twilio(TWILIO_ACCOUNT_SID.value(), TWILIO_AUTH_TOKEN.value());
    const smsBody =
      `New Ranchie Booking\n` +
      `${booking.name || "N/A"}\n` +
      `${booking.pickup || "N/A"} to ${booking.destination || "N/A"}\n` +
      `${booking.date || "N/A"} at ${booking.time || "N/A"}\n` +
      `Phone: ${booking.phone || "N/A"}`;

    for (const to of SMS_RECIPIENTS) {
      try {
        await smsClient.messages.create({ body: smsBody, from: TWILIO_FROM, to });
        console.log(`SMS sent to ${to}`);
      } catch (smsErr) {
        console.error(`SMS failed to ${to}: ${smsErr.message}`);
      }
    }
  } catch (twilioErr) {
    console.error(`Twilio init/send error: ${twilioErr.message}`);
  }

  // --- Customer confirmation SMS (fully isolated: nothing here can affect the blocks above or below) ---
  try {
    const customerNumber = toE164(booking.phone);
    if (!customerNumber) {
      console.log(
        `customer-sms-skipped: booking ${event.params.bookingId} has no usable phone ` +
        `(${booking.phone || "missing"})`
      );
    } else {
      const customerClient = twilio(TWILIO_ACCOUNT_SID.value(), TWILIO_AUTH_TOKEN.value());
      const customerBody =
        "Ranchie Taxi: I have received your booking request. " +
        "I could be driving, but I will send a confirmation within 10 minutes. " +
        `Track your booking: https://www.ranchietaxisvg.com/booking-status/${event.params.bookingId}`;

      await customerClient.messages.create({
        body: customerBody,
        from: TWILIO_FROM,
        to: customerNumber,
      });
      console.log(`Customer confirmation SMS sent to ${customerNumber}`);
    }
  } catch (customerSmsErr) {
    console.error(`customer-sms-failed: ${customerSmsErr.message}`);
  }

  const tokensSnapshot = await db.collection("fcmTokens").get();

  if (tokensSnapshot.empty) {
    console.log("No FCM tokens found");
    return;
  }

  const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

  const message = {
    notification: {
      title: "🚕 New Booking!",
      body: `${booking.name}\n${booking.pickup} → ${booking.destination}\n${booking.date} at ${booking.time}`,
    },
    data: {
      bookingId: event.params.bookingId,
      name: booking.name || "",
      pickup: booking.pickup || "",
      destination: booking.destination || "",
      date: booking.date || "",
      time: booking.time || "",
      phone: booking.phone || "",
      passengers: booking.passengers || "",
      click_action: "https://ranchietaxisvg.com/driver",
    },
    webpush: {
      headers: {
        Urgency: "high",
        TTL: "86400",
      },
      fcmOptions: {
        link: "https://ranchietaxisvg.com/driver",
      },
      notification: {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        vibrate: [300, 100, 300, 100, 300],
        requireInteraction: true,
        tag: "new-booking-" + event.params.bookingId,
        renotify: true,
        actions: [
          { action: "open_dashboard", title: "Open Dashboard" },
        ],
      },
    },
  };

  const results = await Promise.allSettled(
    tokens.map((token) =>
      messaging.send({ ...message, token }).catch(async (error) => {
        if (
          error.code === "messaging/invalid-registration-token" ||
          error.code === "messaging/registration-token-not-registered"
        ) {
          const tokenDoc = tokensSnapshot.docs.find(
            (d) => d.data().token === token
          );
          if (tokenDoc) {
            await db.collection("fcmTokens").doc(tokenDoc.id).delete();
            console.log("Removed invalid token:", token.substring(0, 20));
          }
        }
        throw error;
      })
    )
  );

  const success = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  console.log(`Notifications sent: ${success} success, ${failed} failed`);
});

// ---------------------------------------------------------------------------
// Daily reminder digest - one SMS at 6:00 PM AST summarising tomorrow's
// pickups and any scheduled trips needing attention. Silent on quiet days.
// ---------------------------------------------------------------------------

const DIGEST_HORIZON_DAYS = 3;
const DIGEST_MAX_CHARS = 320; // two SMS segments
const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const DATE_KEY_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

// Calendar date in Ranchie's own timezone. Intl, never toISOString - UTC rolls
// the date over at 8pm AST and would report the wrong day's pickups.
const dateKeyInSvg = (date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/St_Vincent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
};

// Calendar arithmetic on the key itself, so no timezone can shift the result.
const shiftDateKey = (key, days) => {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
};

const shortDate = (key) => {
  const [, m, d] = key.split("-").map(Number);
  return `${MONTH_ABBR[m - 1]} ${d}`;
};

// SMS must be plain ASCII: accented names and arrows become garbled segments.
const ascii = (value, max) => {
  const cleaned = String(value || "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .replace(/;/g, ",")
    .trim();
  if (!cleaned) return "N/A";
  return cleaned.length > max ? `${cleaned.slice(0, max - 1).trim()}.` : cleaned;
};

const buildDigestMessage = (tomorrowEntries, attentionEntries) => {
  const assemble = (tomorrowShown, attentionShown) => {
    let text = "Ranchie Taxi - Good evening.";

    if (tomorrowEntries.length > 0) {
      const hidden = tomorrowEntries.length - tomorrowShown;
      const shown = tomorrowEntries.slice(0, tomorrowShown);
      const label = tomorrowEntries.length === 1 ? "pickup" : "pickups";
      text += ` Tomorrow: ${tomorrowEntries.length} ${label}`;
      if (shown.length > 0) text += ` - ${shown.join("; ")}`;
      if (hidden > 0) text += `; +${hidden} more`;
      text += ".";
    } else {
      text += " Tomorrow: no pickups booked.";
    }

    if (attentionEntries.length > 0) {
      const hidden = attentionEntries.length - attentionShown;
      const shown = attentionEntries.slice(0, attentionShown);
      const label = attentionEntries.length === 1 ? "scheduled trip" : "scheduled trips";
      text += ` Attention: ${attentionEntries.length} ${label} needing review`;
      if (shown.length > 0) text += ` - ${shown.join("; ")}`;
      if (hidden > 0) text += `; +${hidden} more`;
      text += ".";
    }

    return `${text} Please review your dashboard.`;
  };

  let tomorrowShown = tomorrowEntries.length;
  let attentionShown = attentionEntries.length;
  let message = assemble(tomorrowShown, attentionShown);

  // Drop detail from whichever list is longer until the whole message fits.
  while (message.length > DIGEST_MAX_CHARS && (tomorrowShown > 0 || attentionShown > 0)) {
    if (tomorrowShown >= attentionShown) {
      tomorrowShown -= 1;
    } else {
      attentionShown -= 1;
    }
    message = assemble(tomorrowShown, attentionShown);
  }

  return message;
};

exports.sendDailyDigest = onSchedule(
  {
    schedule: "0 18 * * *",
    timeZone: "America/St_Vincent",
    secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN],
  },
  async () => {
    const db = getFirestore();

    const todayKey = dateKeyInSvg(new Date());
    const tomorrowKey = shiftDateKey(todayKey, 1);
    const horizonKey = shiftDateKey(todayKey, DIGEST_HORIZON_DAYS);

    // One read of the collection, then filter in memory: a range on `date`
    // combined with an equality on `status` would need a composite index.
    const snapshot = await db.collection("bookings").get();
    const bookings = snapshot.docs.map((doc) => doc.data());

    const resolveKey = (booking) =>
      booking.date === "Today" ? todayKey : booking.date;

    const tomorrowBookings = bookings
      .filter((b) => b.status === "accepted" || b.status === "confirmed")
      .filter((b) => resolveKey(b) === tomorrowKey)
      .sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));

    const attentionBookings = bookings
      .filter((b) => b.status === "scheduled")
      .map((b) => ({ booking: b, key: resolveKey(b) }))
      .filter((item) => DATE_KEY_PATTERN.test(item.key) && item.key <= horizonKey)
      .sort((a, b) => (a.key === b.key ? 0 : a.key < b.key ? -1 : 1));

    if (tomorrowBookings.length === 0 && attentionBookings.length === 0) {
      console.log(`Daily digest ${todayKey}: nothing to report - no SMS sent`);
      return;
    }

    const tomorrowEntries = tomorrowBookings.map(
      (b) => `${ascii(b.name, 12)} ${ascii(b.time, 5)} ${ascii(b.destination, 14)}`
    );

    const attentionEntries = attentionBookings.map((item) => {
      const overdue = item.key < todayKey ? " (date passed)" : "";
      return `${ascii(item.booking.name, 12)} ${shortDate(item.key)}${overdue}`;
    });

    const smsBody = buildDigestMessage(tomorrowEntries, attentionEntries);
    console.log(
      `Daily digest ${todayKey}: ${tomorrowBookings.length} tomorrow, ` +
      `${attentionBookings.length} needing attention, ${smsBody.length} chars`
    );

    try {
      const smsClient = twilio(TWILIO_ACCOUNT_SID.value(), TWILIO_AUTH_TOKEN.value());
      for (const to of SMS_RECIPIENTS) {
        try {
          await smsClient.messages.create({ body: smsBody, from: TWILIO_FROM, to });
          console.log(`Digest SMS sent to ${to}`);
        } catch (smsErr) {
          console.error(`Digest SMS failed to ${to}: ${smsErr.message}`);
        }
      }
    } catch (twilioErr) {
      console.error(`Digest Twilio init/send error: ${twilioErr.message}`);
    }
  }
);
