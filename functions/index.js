const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

exports.sendBookingNotification = onDocumentCreated("bookings/{bookingId}", async (event) => {
  const booking = event.data.data();
  const db = getFirestore();
  const messaging = getMessaging();

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
      click_action: "/driver",
    },
    webpush: {
      fcmOptions: {
        link: "/driver",
      },
      notification: {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        vibrate: [300, 100, 300, 100, 300],
        requireInteraction: true,
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