import express, { Request, Response } from "express";
import jwt, { Secret } from 'jsonwebtoken';

import authMiddleware from "../middleware/authMiddleware";
import * as userController from '../controllers/userController'
import AuthController from '../controllers/authController'
import * as adminContller from '../controllers/adminController'
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router()

router.post('/register', userController.createNewUser)
router.post('/login', AuthController.userLogin)
// router.post('/checkAuth', AuthController.checkAuth)
// router.get('/checkMiddleware', authMiddleware.isAuthenticated , (req: Request, res:Response) => {
//     const data = 'cek oke'

//     return res.json({message: data})
// })
// router.get('/checkAuths',authMiddleware.isAuthenticated, adminContller.checkData)

export default router;