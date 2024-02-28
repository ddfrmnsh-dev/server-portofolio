import express, {Request, Response} from "express";
import userRouter from "./routes/userRoutes";
import adminRouter from './routes/adminRoutes'
import cors from 'cors';
import bodyParser from 'body-parser';
import ejsLayout from 'express-ejs-layouts';
import flash from "connect-flash";
import session from 'express-session';
import cookieParser from "cookie-parser";

const app = express()
const router = express.Router()

// Middleware untuk mengaktifkan CORS
app.use(cors());

// Middleware untuk parsing body dari request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(ejsLayout)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(flash());
app.use(cookieParser())
app.set('views', './views')
app.set('view engine', 'ejs')

// app.use((req, res) => {
//   res.status(401).send('Unauthorized');
// });
router.get('/', function tesRoute(req: Request, res: Response) {
    return res.redirect('/admin')
})
app.use(router)
app.use('/admin',adminRouter)
app.use(userRouter)

export default app