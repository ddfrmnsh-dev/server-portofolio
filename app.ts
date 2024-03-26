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

const app = express();
const router = express.Router();

// Middleware untuk mengaktifkan CORS
app.use(cors());
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(methodOvveride("_method"));
// Middleware untuk parsing body dari request
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
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
// app.use(express.static(__dirname + "public"));
// app.use('/', express.static('public'))
// var dir = path.join(__dirname, 'public');
// app.use(express.static(dir));

// app.use((req, res) => {
//   res.status(401).send('Unauthorized');
// });
app.use(router);
app.use("/admin", adminRouter);
app.use(userRouter);
app.use("/api", apiRouter);
router.get("/", function tesRoute(req: Request, res: Response) {
  return res.redirect("/admin");
});
// app.use(function (req, res, next) {
//   next(createError(404));
// });

export default app;
