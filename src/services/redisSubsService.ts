import { redisPublisher, redisSubscriber } from "../utils/redis";
import { getIoInstance } from "../utils/socket";

export const subscribeToNotifications = async () => {
  await redisSubscriber.subscribe("notifications", (message) => {
    try {
      const { userId, message: notifMessage } = JSON.parse(message);
      const io = getIoInstance(); // ✅ Ambil instance WebSocket yang sudah ada

      console.log(`📩 New Notification for User ${userId}: ${notifMessage}`);

      // 🔥 Kirim notifikasi ke user yang bersangkutan
      io.to(`user_${userId}`).emit("notification", notifMessage);
    } catch (error) {
      console.error("❌ Error processing notification:", error);
    }
  });

  console.log("✅ Redis subscriber listening for notifications");
};
export const startSubscriber = async () => {
  // await connectRedis();
  const subscriber = redisSubscriber;

  await subscriber.subscribe("socket-one", (message) => {
    console.log(`📩 Received message: ${message}`);
    // Tambahkan logika lain, misalnya simpan ke database atau kirim notifikasi
  });

  console.log("✅ Redis Subscriber is listening...");
};

// startSubscriber();
