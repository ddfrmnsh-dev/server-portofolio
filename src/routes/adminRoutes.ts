import express, { Request, Response } from "express";
import jwt, {Secret} from 'jsonwebtoken';

import {authMiddleware} from "../middleware/authMiddleware";
import * as userController from '../controllers/userController'
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router()

router.get('/ejs', (req:Request, res: Response ) => {
    return res.render('pages/home', {layout:'layouts/main-layout',title: 'ini home'});
})

export default router;