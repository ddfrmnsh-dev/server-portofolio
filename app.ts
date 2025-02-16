import express, { Request, Response } from "express";
import userRouter from "./src/routes/userRoutes";
import adminRouter from "./src/routes/adminRoutes";
import apiRouter from "./src/routes/apiRoutes";
import cors from "cors";
import bodyParser from "body-parser";
import ejsLayout from "express-ejs-layouts";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import methodOvveride from "method-override";
import path from "path";
import createError from "http-errors";
import { errorHandler } from "./src/middleware/errorHandler";
import rateLimit from "express-rate-limit";
import healthCheckMiddleware from "./src/middleware/healthCheckMiddleware";
import { connectRedis } from "./src/utils/redis";
import { startSubscriber, subscribeToNotifications } from "./src/services/redisSubsService";
import { initSocket } from "./src/utils/socket";
import { createServer } from "http";
const app = express();
const router = express.Router();
const server = createServer(app); 

const corsOptions = {
  // origin: ["https://ddfrmnsh.tech"],
  origin: ["http://localhost:5173", "https://ddfrmnsh.tech"],
  optionsSuccessStatus: 200,
  credentials: true,
};

// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 20,
//   message: {
//     status: 429,
//     message: "Terlalu banyak permintaan. Coba lagi nanti.",
//   },
// });

// Terapkan middleware untuk semua rute
// app.use(limiter);
app.use(healthCheckMiddleware);
// Middleware untuk mengaktifkan CORS
app.use(cors(corsOptions));
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(methodOvveride("_method"));
// Middleware untuk parsing body dari request
app.use(errorHandler);
app.use(cookieParser());
app.use(flash());
app.use(ejsLayout);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600 * 1000 },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules/tinymce"))
);
app.use(
  "/jquery",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);
app.use(router);
app.use("/admin", adminRouter);
app.use(userRouter);
app.use("/api", apiRouter);
router.get("/", function tesRoute(req: Request, res: Response) {
  return res.redirect("/admin/signin");
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested URL ${req.originalUrl} was not found on this server.`,
  });
});

// const startServer = async () => {
//   await connectRedis(); // Menunggu koneksi Redis sebelum menjalankan server
//   console.log("✅ Redis Connected");
//   await startSubscriber();
//   await subscribeToNotifications();
//   // initSocket(server); 
// };

// startServer();

export default app;
