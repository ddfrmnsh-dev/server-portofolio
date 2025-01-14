import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

const saveUser = async (name: string, email: string, password: string) => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const findById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const findByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

export { saveUser, findByEmail, findById };