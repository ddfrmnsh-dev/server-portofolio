import { Request, Response } from "express";
import * as userService from "../services/userService";
import bcrypt from "bcrypt";
import User from "../models/userModel";

const createNewUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const hashPwd = await bcrypt.hash(password, 10);
        let params: any = {
            name,
            email,
            password: hashPwd,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        let newUser = new User(params);
        const user = await userService.createUser(newUser);
        res.status(201).json(User.desentizedUser(params));
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export {
    createNewUser,
}