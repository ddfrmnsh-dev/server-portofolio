import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findAllClient = async (limit: number, offset: number, order: any) => {
    try {
        const client = await prisma.client.findMany({
          take: limit,
          skip: offset,
          orderBy: {
            createdAt: order,
          },
        });
        return client;
      } catch (error) {
        console.log("Error", error);
        return error;
      }
}

const saveClient = async (params: any) => {
    try {
        const client = await prisma.client.create({
          data: {
            name: params.name,
            pathLogo: `images/${params.files}`,
          },
        });

        return client;
      } catch (error) {
        console.log("Error", error);
        return error;
      }
}
const updateClient = async (params: any) => {
    try {
        const client = await prisma.client.update({
          where: {
            id: params.id,
          },
          data: {
            name: params.name,
            pathLogo: `images/${params.files}`,
          },
        });
        return client;
      } catch (error) {
        console.log("Error", error);
        return error;
      }
}
const deleteClient = async (id: number) => {
    try {
        const client = await prisma.client.delete({
          where: {
            id,
          },
        });
        return client;
      } catch (error) {
        console.log("Error", error);
        return error;
      }
}
const findClientById = async (id: number) => {
    try {
        const client = await prisma.client.findUnique({
          where: {
            id,
          },
        });
        return client;
      } catch (error) {
        console.log("Error", error);
        return error;
      }
}

const countAllClient = async () => {
    try {
        const projects = await prisma.client.count();
        return projects;
      } catch (error) {
        console.log("Error", error);
        return error;
      }
}

export { findAllClient, countAllClient, saveClient, updateClient, deleteClient, findClientById };