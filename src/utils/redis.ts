import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_HOST = "192.168.10.100"; // IP Lokal Redis
const REDIS_PORT = 6379;

// 🔥 Buat client untuk PUBLISH
const redisPublisher = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

// 🔥 Buat client untuk SUBSCRIBE
const redisSubscriber = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

// ✅ Handle error Redis
redisPublisher.on("error", (err) => console.error("❌ Redis Publisher Error:", err));
redisSubscriber.on("error", (err) => console.error("❌ Redis Subscriber Error:", err));

export const connectRedis = async () => {
  try {
    await redisPublisher.connect();
    await redisSubscriber.connect();
    console.log("✅ Connected to Redis (Publisher & Subscriber)");
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err);
  }
};

export const safePublish = async (channel:any, message:any) => {
  if (!redisPublisher.isReady) {
    console.warn("⚠️ Redis Publisher not connected. Skipping publish...");
    return;
  }
  try {
    await redisPublisher.publish(channel, message);
  } catch (err) {
    console.error("❌ Redis Publish Error:", err);
  }
};

// 🛠 Helper untuk subscribe dengan error handling
export const safeSubscribe = async (channel:any, callback:any) => {
  if (!redisSubscriber.isReady) {
    console.warn("⚠️ Redis Subscriber not connected. Skipping subscribe...");
    return;
  }
  try {
    await redisSubscriber.subscribe(channel, callback);
  } catch (err) {
    console.error("❌ Redis Subscribe Error:", err);
  }
};

export { redisPublisher, redisSubscriber };
