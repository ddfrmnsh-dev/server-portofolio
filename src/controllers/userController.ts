import { Request, Response } from "express";
import * as userService from "../services/userService";
import bcrypt from "bcrypt";
import jwt, {Secret} from 'jsonwebtoken';
import { User } from "@prisma/client";

let secret = process.env.TOKEN_SECRET

const createNewUser = async (req: Request, res: Response) => {
    const {name, email, password, username} = req.body;
    try {
        const user = await userService.createUser(name, email, password, username);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({error :"Error"});
    }
}

export {
    createNewUser,
}