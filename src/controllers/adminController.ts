import { Request, Response } from "express";
import * as userService from "../services/userService";
import bcrypt from "bcrypt";
import jwt, {Secret} from 'jsonwebtoken';
import { User } from "@prisma/client";

let secret = process.env.TOKEN_SECRET
const adminLogin = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const user = await userService.getUserByEmail(email);
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                const token = jwt.sign({email}, <Secret>secret, {expiresIn: '1h'})
                return res.status(200).json({"user" :{
                    "name" : user.name,
                    "email" : user.email,
                    "createdAt" : user.createdAt,
                    "updatedAt" : user.updatedAt,
                },token})
            } else {
                return res.status(401).json({message: "Password salah"})
            }
        } else {
            res.status(401).json({message: "User tidak ditemukan"})
        }
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({error :"Error"})
    }
}

const getDashboardAdmin = async (req: Request, res: Response) => {
    return res.render('pages/dashboard', {layout: 'layouts/main-layout', title:'Dashboard'})
}


export {
    adminLogin,
    getDashboardAdmin
}