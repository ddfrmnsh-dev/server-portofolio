import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createClient = async (params: any) => {
  try {
    const client = await prisma.client.create({
      data: {
        name: params.name,
        path_logo: params.path_logo,
      },
    });

    return client;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const getAllClient = async () => {
  try {
    const data = await prisma.client.findMany();

    return data;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const getClientById = async (params: any) => {
  try {
    const data = await prisma.client.findFirst({
      where: {
        id: params.id,
      },
    });

    return data;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const updateClient = async (params: any) => {
  try {
    const data = await prisma.client.update({
      where: {
        id: params.id,
      },
      data: {
        name: params.name,
        path_logo: params.path_logo,
      },
    });

    return data;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const deleteClient = async (id: number) => {
  try {
    const data = await prisma.client.delete({
      where: {
        id,
      },
    });

    return data;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};
export {
  createClient,
  getAllClient,
  getClientById,
  updateClient,
  deleteClient,
};
