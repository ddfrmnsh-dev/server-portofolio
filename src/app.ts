import express, {Request, Response} from "express";
import userRouter from "./routes/userRoutes";
// import cors from 'cors';
import bodyParser from 'body-parser';

const app = express()
const router = express.Router()

// Middleware untuk mengaktifkan CORS
// app.use(cors());

// Middleware untuk parsing body dari request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function tesRoute(req: Request, res: Response) {
    res.json({"message": "ok"})
})

app.use('/api/user',userRouter)

export default app