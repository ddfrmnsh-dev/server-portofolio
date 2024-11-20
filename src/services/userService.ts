import { PrismaClient, User } from "@prisma/client";
// import { Request, Response,NextFunction } from "express";
import bycrypt from "bcrypt";

const prisma = new PrismaClient();

export interface CreateUserError extends Error {
  statusCode?: number;
}

const createUser = async (name: string, email: string, password: string) => {
  try {
    const hashPwd = await bycrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPwd,
      },
    });
    return user;
  } catch (error) {
    console.log("Error", error);
    return error;
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
    error;
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
        is_active: true,
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
    const count = await prisma.user.count({ where: { is_active: true } });
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
