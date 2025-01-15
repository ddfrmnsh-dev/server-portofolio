import { PrismaClient, User } from "@prisma/client";
// import { Request, Response,NextFunction } from "express";
import bycrypt from "bcrypt";
import { findByEmail, saveUser } from "../repository/userRepository";

const prisma = new PrismaClient();

export interface CreateUserError extends Error {
  statusCode?: number;
}

const createUser = async (name: string, email: string, password: string) => {
  try {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const existingUser = await findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bycrypt.hash(password, 10);
    const user = await saveUser(name, email, hashedPassword);

    return user;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const getUserByEmail = async (email: string) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return findUser;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const getUser = async (id: number) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return findUser;
  } catch (error) {
    console.log("Error", error);
    error;
  }
};

const updateUser = async (
  id: number,
  name: string,
  email: string,
  password: string
) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (findUser) {
      const hashPwd = await bycrypt.hash(password, 10);
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
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.log("Error", error);
    error;
  }
};

const deleteUser = async (id: number) => {
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
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.log("Error", error);
    error;
  }
};

const getAllUser = async (take: number, skip: number, order: any) => {
  try {
    const findUser = await prisma.user.findMany({
      take: take,
      skip: skip,
      orderBy: {
        createdAt: order
      },
      select: {
        id: true,
        name: true,
        email: true,
        profession: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return findUser;
  } catch (error) {
    console.log("Error", error);
    error;
  }
};

const countUser = async () => {
  try {
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const countUserActive = async () => {
  try {
    const count = await prisma.user.count({ where: { isActive: true } });
    return count;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
}
export {
  countUserActive,
  countUser,
  createUser,
  getUserByEmail,
  getUser,
  updateUser,
  deleteUser,
  getAllUser,
};
