import express, { Request, Response } from "express";
import jwt, {Secret} from 'jsonwebtoken';

import authMiddleware from "../middleware/authMiddleware";
import * as adminController from '../controllers/adminController'
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router()

router.get('/', (req:Request, res: Response ) => {
    return res.render('index', {layout:'index',title: 'Login'});
})

router.post('/login', adminController.adminLogin)

router.get('/dashboard', authMiddleware.isAuthenticated, adminController.getDashboardAdmin);

// router.get('/', (req:Request, res: Response ) => {
//     return res.render('pages/home', {layout:'layouts/main-layout',title: 'Login'});
// })

export default router;