import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

initializeApp();

const db = getFirestore();
const messaging = getMessaging();

// Triggered when a new booking is created
export const onNewBooking = onDocumentCreated("bookings/{bookingId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const booking = snapshot.data();
  const bookingId = event.params.bookingId;

  console.log("New booking created:", bookingId, booking);

  // Get all registered device tokens
  const tokensSnapshot = await db.collection("fcmTokens").get();

  if (tokensSnapshot.empty) {
    console.log("No registered devices found");
    return;
  }

  const tokens: string[] = [];
  tokensSnapshot.forEach((doc) => {
    const token = doc.data().token;
    if (token) {
      tokens.push(token);
    }
  });

  if (tokens.length === 0) {
    console.log("No valid tokens found");
    return;
  }

  // Create notification payload
  const payload = {
    tokens: tokens,
    notification: {
      title: "🚕 New Booking!",
      body: `${booking.name}: ${booking.pickup} → ${booking.destination}`,
    },
    data: {
      bookingId: bookingId,
      pickup: booking.pickup || "",
      destination: booking.destination || "",
      date: booking.date || "",
      time: booking.time || "",
      name: booking.name || "",
      click_action: "/driver",
    },
    webpush: {
      fcmOptions: {
        link: "/driver",
      },
      notification: {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        vibrate: [200, 100, 200] as number[],
        requireInteraction: true,
      },
    },
  };

  try {
    const response = await messaging.sendEachForMulticast(payload);
    console.log("Notifications sent:", response.successCount, "successful,", response.failureCount, "failed");

    // Clean up invalid tokens
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });

      // Delete invalid tokens from database
      for (const token of failedTokens) {
        const tokenDocs = await db.collection("fcmTokens").where("token", "==", token).get();
        tokenDocs.forEach((doc) => doc.ref.delete());
      }
    }

    return response;
  } catch (error) {
    console.error("Error sending notifications:", error);
    return;
  }
});