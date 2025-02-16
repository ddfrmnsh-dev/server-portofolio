import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = "amqp://192.168.10.100:5672";
// const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

// 🔥 Buat koneksi dan channel secara global
let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

// ✅ Koneksi ke RabbitMQ
export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");

    // Handle close connection
    connection.on("close", () => {
      console.warn("⚠️ RabbitMQ connection closed. Reconnecting...");
      setTimeout(connectRabbitMQ, 5000);
    });

    // Handle error connection
    connection.on("error", (err) => {
      console.error("❌ RabbitMQ Connection Error:", err);
    });
  } catch (err) {
    console.error("❌ Failed to connect to RabbitMQ:", err);
    setTimeout(connectRabbitMQ, 5000);
  }
};

// 🛠 Helper untuk publish pesan
export const safePublish = async (queue: string, message: object) => {
  if (!channel) {
    console.warn("⚠️ RabbitMQ Channel not ready. Skipping publish...");
    return;
  }
  try {
    await channel.assertQueue(queue, { durable: true,  arguments: { 'x-queue-mode': 'default' } });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`📨 Message published to queue "${queue}":`, message);
  } catch (err) {
    console.error("❌ RabbitMQ Publish Error:", err);
  }
};

// 🛠 Helper untuk subscribe dengan callback
export const safeSubscribe = async (queue: string, callback: (msg: string) => void) => {
  if (!channel) {
    console.warn("⚠️ RabbitMQ Channel not ready. Skipping subscribe...");
    return;
  }
  try {
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg) => {
      if (msg) {
        const message = msg.content.toString();
        console.log(`📬 Message received from queue "${queue}":`, message);
        callback(message);
        channel?.ack(msg);
      }
    });
    console.log(`👂 Subscribed to queue "${queue}"`);
  } catch (err) {
    console.error("❌ RabbitMQ Subscribe Error:", err);
  }
};
