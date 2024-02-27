import express, { Request, Response } from "express";
import jwt, {Secret} from 'jsonwebtoken';

import authMiddleware from "../middleware/authMiddleware";
import * as adminController from '../controllers/adminController'
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router()

router.get('/signin', adminController.viewSignin)
router.post('/signin', adminController.adminLoginSession)

router.use(authMiddleware.isLogin)
router.post('/logout', adminController.adminLogin)
router.get('/dashboard', adminController.viewDashboard);

// router.get('/dashboard', authMiddleware.isAuthenticated, adminController.viewDashboard);
// router.get('/getAllUsers', authMiddleware.isAuthenticated, adminController.getAllUser);
// router.put('/updateUser/:id', authMiddleware.isAuthenticated, adminController.updateUser);
// router.delete('/deleteUser/:id', authMiddleware.isAuthenticated, adminController.deleteUser);

export default router;