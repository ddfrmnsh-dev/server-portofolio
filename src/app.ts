import express, {Request, Response} from "express";
import userRouter from "./routes/userRoutes";
import adminRouter from './routes/adminRoutes'
import cors from 'cors';
import bodyParser from 'body-parser';
import ejsLayout from 'express-ejs-layouts';

const app = express()
const router = express.Router()

// Middleware untuk mengaktifkan CORS
app.use(cors());

// Middleware untuk parsing body dari request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(ejsLayout)
app.set('views', './views')
app.set('view engine', 'ejs')

// app.use((req, res) => {
//   res.status(401).send('Unauthorized');
// });
router.get('/', function tesRoute(req: Request, res: Response) {
    return res.json({"message": "ok"})
})

app.use(adminRouter)

app.use(userRouter)

export default app