import { Request, Response, NextFunction } from "express";
import * as projectService from "../../services/projectService";
import { apiResponse } from "../../utils/responseApi";
const getAllProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const order = (req.query.order as string) || "asc";
    const offset = (page - 1) * limit;

    const projects = await projectService.getAllProject(limit, offset, order);

    if (!projects) {
      return res.status(404).json({ message: "Project not found" });
    }

    const totalProjects: any = await projectService.countProject();
    if (totalProjects === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    const totalPages = Math.ceil(totalProjects / limit);

    const data: any = {
      projects,
      total: totalPages,
      page: page,
      limit: limit,
    };

    return res.json(apiResponse("Get all Projects", 200, "Success", data));
  } catch (error) {
    console.error("Error", error);
    next(error);
  }
};

export { getAllProject };
