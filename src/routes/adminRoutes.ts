import express, { Request, Response } from "express";
import jwt, {Secret} from 'jsonwebtoken';

import authMiddleware from "../middleware/authMiddleware";
// import storage from "../middleware/multerUpload";
import * as adminController from '../controllers/adminController'
import dotenv from 'dotenv';
import upload from "../middleware/multerUpload";
dotenv.config();


const router = express.Router()

router.get('/signin', adminController.viewSignin)
router.post('/signin', adminController.adminLoginSession)

router.use(authMiddleware.isLogin)
router.get('/logout', adminController.adminLogout)
router.get('/dashboard', adminController.viewDashboard);
router.get('/project', adminController.viewProject);
router.post('/project', upload('images').single('img'), adminController.createProject);
// router.get('/dashboard', authMiddleware.isAuthenticated, adminController.viewDashboard);
// router.get('/getAllUsers', authMiddleware.isAuthenticated, adminController.getAllUser);
// router.put('/updateUser/:id', authMiddleware.isAuthenticated, adminController.updateUser);
// router.delete('/deleteUser/:id', authMiddleware.isAuthenticated, adminController.deleteUser);

export default router;