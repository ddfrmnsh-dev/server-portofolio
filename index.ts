// 

import { createServer } from "http";
import app from "./app";
import { initSocket } from "./src/utils/socket";
import { connectRedis } from "./src/utils/redis";
import { startSubscriber, subscribeToNotifications } from "./src/services/redisSubsService";
import { connectRabbitMQ } from "./src/utils/rabbitmq";
import { startConsumeRabbit } from "./src/services/rabbitSubsService";

const PORT = process.env.PORT || 3001;
const HOST = "localhost";

const server = createServer(app); // ✅ Buat server HTTP
// const io = initSocket(server); // ✅ Inisialisasi WebSocket dengan server HTTP

const startServer = async () => {
  // await connectRedis();
  // console.log("✅ Redis Connected");
  // await startSubscriber();
  // await subscribeToNotifications();
  
  // await connectRabbitMQ();
  // console.log("✅ RabbitMQ Connected");
  // await startConsumeRabbit()

  server.listen(PORT, () => {
    console.log(`🚀 Server berjalan pada http://${HOST}:${PORT}`);
  });
};

startServer();
