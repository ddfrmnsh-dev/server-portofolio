import express, { Request, Response } from "express";
import jwt, {Secret} from 'jsonwebtoken';

import {authMiddleware} from "../middleware/authMiddleware";
import * as userController from '../controllers/userController'
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router()

router.post('/register', userController.createNewUser)
router.post('/login', userController.userLogin)
router.get('/checkMiddleware', authMiddleware, (req: Request, res:Response) => {
    const data = 'cek oke'

    return res.json({message: data})
})

export default router;