import { PrismaClient } from "@prisma/client";
import bycrypt from "bcrypt";
import { countProject, deleteProject, findAllProject, saveProject, updateProject, findProjectById } from "../repository/projectRepository";
import { findUserById } from "../repository/userRepository";
import slug from "slug";
import fs from "fs-extra";
import path from "path";
import { findImageById } from "../repository/imageRepository";
import { unlinkSync } from "fs";



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
    const project = await findAllProject(take, skip, order);
    
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
    const project = await findProjectById(id);

    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const updateProjectss = async (params: any) => {
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

    const checkProject: any = await findProjectById(id);

    if (!checkProject) {
      throw new Error("Project not found");
    }

    const getImage: any = await findImageById(checkProject.id);
    if (getImage?.pathImg) {
      const deleteImgPath = path.join("public", getImage.pathImg);
    
      // Cek apakah file benar-benar ada sebelum menghapus
      if (fs.existsSync(deleteImgPath)) {
        try {
          await fs.unlink(deleteImgPath);
          // await unlinkSync(deleteImgPath);
          console.log(`File deleted: ${deleteImgPath}`);
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      } else {
        console.warn(`File not found, skipping delete: ${deleteImgPath}`);
      }
    } else {
      console.warn("Image path is undefined, skipping delete.");
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

const updateProjects = async (params: any, ids: number) => {
  try {
    if (!ids) {
      throw new Error("Missing required fields");
    }

    const checkProject: any = await findProjectById(ids);
    if (!checkProject) {
      throw new Error("Project not found");
    }

    console.log("params.files", params.files);
    if(params.files !== undefined && checkProject.image[0].pathImg) {
      const splitPath = checkProject.image[0].pathImg.split("/");
      const lastIndex = splitPath[splitPath.length - 1];

      if (lastIndex !== "undefined") {
            const deleteImgPath = path.join("public", checkProject.image[0].pathImg);
            try {
              await fs.unlink(deleteImgPath);
              console.log(`Deleted old image: ${deleteImgPath}`);
            } catch (err) {
              console.error(`Failed to delete old image: ${deleteImgPath}`, err);
            }
      }
    }


    // const getImage: any = await findImageById(checkProject.id);
    // if (getImage) {
    //   const oldImagePath = `public/${getImage.pathImg}`;
    //     await fs.unlink(path.join(oldImagePath));
    // }

    const updatedParams = { ...params, files: params.files ? params.files : checkProject.image[0].pathImg };

    const updatedProject = await updateProject(updatedParams, ids);

    return updatedProject;
  } catch (error) {
    console.error("Error in updateProjects:", error);
    throw error;
  }
};


export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjects,
  deleteProjects,
  countProjects,
};
