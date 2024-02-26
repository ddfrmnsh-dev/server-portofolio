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

const viewDashboard = async (req: Request, res: Response) => {
    try {
        return res.render('pages/dashboard', {layout: 'layouts/main-layout', title:'Dashboard'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const checkData = async (req: Request, res: Response) => {
    try {
        res.json({ message: 'Halo, ' + req.decoded.user + '! Anda memiliki role ' + req.decoded.email });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUser();
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

//create function update user get id by params
const updateUser = async (req: Request, res: Response) => {
    try {
        const { id, name, email, password } = req.body;
        const user = await userService.getUser(id);
        if (user) {
            // const hashPwd = await bcrypt.hash(password, 10);
            const updateUser = await userService.updateUser(id, name, email, password);
            return res.status(200).json(updateUser);
        } else {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export {
    adminLogin,
    viewDashboard,
    checkData,
    getAllUser,
    updateUser
}