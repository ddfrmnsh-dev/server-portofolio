import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

const saveUser = async (name: string, email: string, password: string, username:string) => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        username
      },
    });

    return user;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const findUserById = async (id: number) => {
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

const updateUsers = async (params: any, id: number) => {
  try {
    console.log("paramsa isactive repo", params.isActive);
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {...params},
    });

    return user
  } catch (error) {
    return error
  }
}
export { saveUser, findByEmail, findUserById, updateUsers };