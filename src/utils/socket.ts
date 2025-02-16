import { Server } from "socket.io";

let io: Server | null = null;

export const initSocket = (server: any) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "http://localhost:5173", // ✅ Izinkan frontend
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ New client connected:", socket.id);

      socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`✅ Client joined room: ${room}`);
      });

      socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    
      socket.on("error", (err) => {
        console.error("🔥 Socket Error:", err);
      });

    });

    console.log("🚀 WebSocket Server Initialized");
  }
  return io;
};

export const getIoInstance = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};
