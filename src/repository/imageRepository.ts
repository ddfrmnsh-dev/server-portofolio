import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findImageById = async (id: number) => {
  try {
    const image = await prisma.image.findFirst({
      where: {
        projectId: id,
      },
    });
    return image;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const findImagePostById= async (id: number[]) => {
  try {
    const image = await prisma.image.findMany({
      where: {
        id: {
          in: id,
        }
      },
      select: {
        id: true,
        name: true,
        pathImg: true,
      }
    });
    
    console.log("repo img",image);
    return image;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

export { findImageById, findImagePostById };