const { onDocumentCreated } = require("firebase-functions/v2/firestore");
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

initializeApp();

exports.sendBookingNotification = onDocumentCreated(
  {
    document: "bookings/{bookingId}",
    secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN],
  },
  async (event) => {
  const booking = event.data.data();
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