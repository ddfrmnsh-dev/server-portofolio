// import {PrismaClient, User} from "@prisma/client";
// import { Request, Response,NextFunction } from "express";
import bycrypt from "bcrypt";
import db from "../utils/DatabaseService";
import User from "../models/userModel";

// const prisma = new PrismaClient(); 

export interface CreateUserError extends Error {
    statusCode? : number;
}

// const createUser = async (name: string, email:string, password:string) => {
//     try {
//         const hashPwd = await bycrypt.hash(password, 10);
//         const user = await prisma.user.create({
//             data: {
//                 name,
//                 email,
//                 password: hashPwd
//             }
//         })
//         return user
//     } catch (error) {
//         console.log("Error", error)
//         return error
//     }
// }

// const getUserByEmail = async (email: string) => {
//     try {
//         const findUser = await prisma.user.findUnique({
//             where: {
//                  email
//             }
//         })
//         return findUser
//     } catch (error) {
//         console.log("Error", error)
//         error
//     }
// }

export async function getUserByEmail(email:string): Promise<User | null> {
    let findUser = await db.query('SELECT * FROM user WHERE email = ? ', [email]);
    // console.log(findUser); 
    if(findUser.rowCount === 0){
        return null
    } else {
        return findUser[0];
    }
}

// const getUser = async (id: number): Promise<User> => {
//     try {
//         const findUser = await db.query("SELECT * FROM users WHERE id = $1", [id]);
//         return findUser
//     } catch (error) {
//         console.log("Error", error)
//         error
//     }
// }
export async function getUser(id:number | string): Promise<User | null> {
    let findUser = await db.query('SELECT * FROM user WHERE id = ? ', [id]);
    if(findUser.rowCount === 0){
        return null
    } else {
        return findUser[0]
    }
}
// const updateUser = async (id: number, name: string, email: string, password: string) => {
//     try {
//         const findUser = await prisma.user.findUnique({
//             where: {
//                 id
//             }
//         })
//         if(findUser){
//             const hashPwd = await bycrypt.hash(password, 10);
//             const updateUser = await prisma.user.update({
//                 where: {
//                     id
//                 },
//                 data: {
//                     name,
//                     email,
//                     password: hashPwd
//                 },
//                 select:{
//                     id: true,
//                     name: true,
//                     email: true,
//                     createdAt: true,
//                     updatedAt: true
//                 }
//             })
//             //return data only selected fields
            
//             return updateUser
//         } else {
//             throw new Error("User not found")
//         }
//     } catch (error) {
//         console.log("Error", error)
//         error
//     }
// }

// const deleteUser = async (id: number) => {
//     try {
//         const findUser = await prisma.user.findUnique({
//             where: {
//                 id
//             }
//         })
//         if(findUser){
//             const deleteUser = await prisma.user.delete({
//                 where: {
//                     id
//                 },
//                 select:{
//                     id: true,
//                     name: true,
//                     email: true,
//                     createdAt: true,
//                     updatedAt: true
//                 }
//             })
//             return deleteUser
//         } else {
//             throw new Error("User not found")
//         }
//     } catch (error) {
//         console.log("Error", error)
//         error
//     }
// }

// const getAllUser = async () => {
//     try {
//         const findUser = await prisma.user.findMany({
//             select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 createdAt: true,
//                 updatedAt: true
//             }
//         })
//         return findUser
//     } catch (error) {
//         console.log("Error", error)
//         error
//     }
// }

// export {
//     createUser,
//     getUserByEmail,
//     getUser,
//     updateUser,
//     deleteUser,
//     getAllUser
// }