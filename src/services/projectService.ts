import { PrismaClient } from "@prisma/client";
import bycrypt from "bcrypt";
import { countProject, deleteProject, getAllProject, saveProject } from "../repository/projectRepository";
import { findById } from "../repository/userRepository";

const prisma = new PrismaClient();

const createProject = async (params: any) => {
  try {
    if (!params.files || params.files.length === 0) {
      throw new Error("No files uploaded");
    }

    if (!params.name || !params.slug || !params.description) {
      throw new Error("Missing required fields");
    }
    const project = await saveProject(params);

    return project;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const getAllProjects = async (take: number, skip: number, order: any) => {
  try {
    const project = await getAllProject(take, skip, order);
    
    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const countProjects = async () => {
  try {
    const project = await countProject();
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
        linkWebsite: params.link,
        clientId: params?.client,
      },
    });
    return project;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const deleteProjects = async (id: number) => {
  try {
    if (!id) {
      throw new Error("Missing required fields");
    }

    const checkProject = await findById(id);

    if (!checkProject) {
      throw new Error("Project not found");
    }

    const project = await deleteProject(id);

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};
export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProjects,
  countProjects,
};
