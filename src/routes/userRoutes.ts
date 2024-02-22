import express, { Request, Response } from "express";
import jwt, {Secret} from 'jsonwebtoken';

import {authMiddleware} from "../middleware/authMiddleware";
import * as userController from '../controllers/userController'
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router()
let secret = process.env.TOKEN_SECRET

router.post('/register', userController.createNewUser)
router.post('/checkAuth', userController.userLogin)

router.post('/login', (req:Request, res: Response) => {
     // Proses autentikasi pengguna
    const username = req.body.username;
    const password = req.body.password;

    // console.log('cek', username);
    // console.log('cek pwd', password);
    // Misalnya, dalam contoh sederhana ini, Anda dapat menentukan pengguna tetap dengan username 'admin' dan password '123456'
    if (username === 'admin' && password === '123456') {
        // Jika autentikasi berhasil, buat token JWT
        const token = jwt.sign({ username }, <Secret>secret, { expiresIn: '1h' });

        // Kirim token sebagai respons
        res.json({ token });
    } else {
        // Jika autentikasi gagal, kirim pesan kesalahan
        res.status(401).json({ message: 'Autentikasi gagal' });
    }

//     router.get('/profile', authMiddleware, (req: Request, res: Response) => {
//     // Dapatkan data pengguna dari objek request yang telah diset oleh middleware authMiddleware
//     const username = (req.user as any).username;

//     // Kirim data pengguna sebagai respons
//     res.json({ username });
// });
})


export default router;