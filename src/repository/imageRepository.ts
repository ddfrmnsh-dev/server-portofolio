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

export { findImageById };