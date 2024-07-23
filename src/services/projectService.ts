import { PrismaClient } from "@prisma/client";
import bycrypt from "bcrypt";

const prisma = new PrismaClient();

const createProject = async (params: any) => {
  try {
    const files = params.files;
    const project = await prisma.$transaction(async (prisma) => {
      const newProject = await prisma.project.create({
        data: {
          name: params.name,
          userId: params.userId,
          slug: params.slug,
          description: params.description,
          link_website: params.link,
          clientId: params.clientId,
        },
      });

      const imagePromises = files.map((file: any) =>
        prisma.image.create({
          data: {
            name: file.filename,
            projectId: newProject.id,
            path_img: `images/${file.filename}`,
          },
        })
      );

      await Promise.all(imagePromises);
    });
    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const getAllProject = async () => {
  try {
    const project = await prisma.project.findMany({
      include: {
        client: true,
      },
    });
    console.log("client be", project);
    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const getAllProjectAPI = async (take: number, skip: number) => {
  try {
    const project = await prisma.project.findMany({
      take: take,
      skip: skip,
      include: {
        client: true,
        image: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("client be", project);
    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const countProject = async () => {
  try {
    const project = await prisma.project.count();
    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};
const getProjectById = async (id: number) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });
    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const updateProject = async (params: any) => {
  try {
    const project = await prisma.project.update({
      where: {
        id: params.id,
      },
      data: {
        name: params.name,
        slug: params.slug,
        description: params.description,
      },
    });
    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const deleteProject = async (id: number) => {
  try {
    const project = await prisma.project.delete({
      where: {
        id,
      },
    });
    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};
export {
  createProject,
  getAllProject,
  getProjectById,
  updateProject,
  deleteProject,
  getAllProjectAPI,
  countProject,
};
