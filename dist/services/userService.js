"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUserByEmail = exports.createUser = void 0;
const client_1 = require("@prisma/client");
// import { Request, Response,NextFunction } from "express";
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const createUser = async (name, email, password) => {
    try {
        const hashPwd = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPwd,
            },
        });
        return user;
    }
    catch (error) {
        console.log("Error", error);
        return error;
    }
};
exports.createUser = createUser;
const getUserByEmail = async (email) => {
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return findUser;
    }
    catch (error) {
        console.log("Error", error);
        error;
    }
};
exports.getUserByEmail = getUserByEmail;
const getUser = async (id) => {
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        return findUser;
    }
    catch (error) {
        console.log("Error", error);
        error;
    }
};
exports.getUser = getUser;
const updateUser = async (id, name, email, password) => {
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (findUser) {
            const hashPwd = await bcryptjs_1.default.hash(password, 10);
            const updateUser = await prisma.user.update({
                where: {
                    id,
                },
                data: {
                    name,
                    email,
                    password: hashPwd,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            //return data only selected fields
            return updateUser;
        }
        else {
            throw new Error("User not found");
        }
    }
    catch (error) {
        console.log("Error", error);
        error;
    }
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (findUser) {
            const deleteUser = await prisma.user.delete({
                where: {
                    id,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return deleteUser;
        }
        else {
            throw new Error("User not found");
        }
    }
    catch (error) {
        console.log("Error", error);
        error;
    }
};
exports.deleteUser = deleteUser;
const getAllUser = async () => {
    try {
        const findUser = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return findUser;
    }
    catch (error) {
        console.log("Error", error);
        error;
    }
};
exports.getAllUser = getAllUser;
