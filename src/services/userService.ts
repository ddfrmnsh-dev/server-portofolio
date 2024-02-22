import {PrismaClient, User} from "@prisma/client";
// import { Request, Response,NextFunction } from "express";
import bycrypt from "bcrypt";

const prisma = new PrismaClient(); 

export interface CreateUserError extends Error {
    statusCode? : number;
}

const createUser = async (name: string, email:string, password:string) => {
    try {
        const hashPwd = await bycrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPwd
            }
        })
        return user
    } catch (error) {
        console.log("Error", error)
        return error
    }
}

const getUserByEmail = async (email: string) => {
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                 email
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                password: true
            }
        })
        return findUser
    } catch (error) {
        console.log("Error", error)
        error
    }
}
export {
    createUser,
    getUserByEmail
}