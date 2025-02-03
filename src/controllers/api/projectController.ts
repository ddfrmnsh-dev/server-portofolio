import { Request, Response, NextFunction } from "express";
import * as projectService from "../../services/projectService";
import { apiResponse } from "../../utils/responseApi";
import slug from "slug";
const getAllProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const order = (req.query.order as string) || "asc";
    const offset = (page - 1) * limit;

    const projects = await projectService.getAllProjects(limit, offset, order);

    const totalProjects: any = await projectService.countProjects();

    if (totalProjects === 0) {
      return res.status(404).json({status: false, message: "Project not found" });
    }

    const data: any = {
      projects,
      total: totalProjects,
      page: page,
      limit: limit,
    };

    return res.json(apiResponse("Get all Projects", 200, "Success", data));
  } catch (error: any) {
    const errorMessage = error.message || 'An unexpected error occurred';

    if(errorMessage) {
      res.status(400).json({ status: false, error: errorMessage });
    } else {
      res.status(500).json({ status: false, error: 'Internal server error'});
    }
  }
};

const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = await projectService.getProjectById(projectId);

    if (!project) {
      return res.status(404).json({ status: false, message: "Project not found" });
    }

    return res.json(apiResponse("Get project by ID", 200, "Success", project));

    } catch (error: any) {
    const errorMessage = error.message || 'An unexpected error occurred';

    if(errorMessage) {
      res.status(400).json({ status: false, error: errorMessage });
    } else {
      res.status(500).json({ status: false, error: 'Internal server error'});
    }
  }
}
const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, link, clientId } = req.body;
      const client = parseInt(clientId);
      const id = req.decoded.id;

      const image = req.file;
      
      let params: any = {
        name: name,
        description: description,
        link: link,
        clientId: client,
        userId: id,
        files: image,
        slug: slug(name)
      };

      const project = await projectService.createProject(params);

      return res.json(apiResponse("Successfully add new project", 200, "Success", project));
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';

      console.log("err:",errorMessage);

      if(errorMessage) {
        res.status(400).json({ status: false, error: errorMessage });
      } else {
        res.status(500).json({ status: false, error: 'Internal server error'});
      }
    }
}

const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error("Id tidak ditemukan");
    }

    let params = parseInt(id);
    const item: any = await projectService.deleteProjects(params);

    if (!item) {
      throw new Error("Project tidak ditemukan");
    }
    return res.json(apiResponse("Successfully delete project", 200, "Success", item));
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.message || 'An unexpected error occurred';

    if(errorMessage) {
      res.status(400).json({ status: false, error: errorMessage });
    } else {
      res.status(500).json({ status: false, error: 'Internal server error'});
    }
  }
}

const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, link, clientId } = req.body;
    const client = parseInt(clientId);
    const idProject = parseInt(id);
    const idUser = req.decoded.id;
    const images = req.file
    const params: any = {
      id: idProject,
      name,
      description,
      link,
      clientId: client,
      userId: idUser,
    };

    if (images !== undefined) {
      params.files = images;
    }

    const item: any = await projectService.updateProjects(params);

    return res.json(apiResponse("Successfully updated project", 200, "Success", item));
  } catch (error: any) {
    console.error(error);

    const errorMessage = error.message || "An unexpected error occurred";
    const statusCode = errorMessage.includes("not found") ? 404 : 400;
    return res.status(statusCode).json({
      status: false,
      error: errorMessage,
    });
  }
};

export { getAllProject, getProjectById,createProject, deleteProject, updateProject }
