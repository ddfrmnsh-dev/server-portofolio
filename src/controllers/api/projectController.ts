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
    
    const totalPages = Math.ceil(totalProjects / limit);

    const data: any = {
      projects,
      total: totalPages,
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

const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, link, clientId } = req.body;
      const client = parseInt(clientId);
      const id = req.decoded.id;

      const image = req.file;

      console.log("image:", image);
      
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

// const updateProject = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//       const { id } = req.params;
//       const { name, description, link, clientId } = req.body;
//       const client = parseInt(clientId);
//       const idUser = req.decoded.id;
//       const image = req.files as Express.Multer.File[];
//       let params: any = {
//         id: id,
//         name: name,
//         description: description,
//         link: link,
//         clientId: client,
//         userId: idUser,
//       };

//       if (image !== undefined){
//         let params: any = {
//           id: id,
//           name: name,
//           description: description,
//           link: link,
//           clientId: client,
//           userId: idUser,
//           files: image,
//         };

//         await projectService.updateProjects(params);
//       } 

//       const item: any = await projectService.updateProjects(params);
//       // if (!item) {
//       //   throw new Error("Project tidak ditemukan");
//       // }
//       return res.json(apiResponse("Successfully update project", 200, "Success", item));
//   } catch (error: any) {
//       console.error(error);
//       const errorMessage = error.message || 'An unexpected error occurred';
//       if(errorMessage) {
//         res.status(400).json({ status: false, error: errorMessage });
//       } else {
//         res.status(500).json({ status: false, error: 'Internal server error'});
//       }
//   }
// }

const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, link, clientId } = req.body;
    const client = parseInt(clientId);
    const idProject = parseInt(id);
    const idUser = req.decoded.id;
    const images = req.file
    // Siapkan parameter dasar
    const params: any = {
      id: idProject,
      name,
      description,
      link,
      clientId: client,
      userId: idUser,
    };

    // Tambahkan files ke params jika ada
    if (images !== undefined) {
      params.files = images;
    }

    // Panggil service untuk memperbarui project
    const item: any = await projectService.updateProjects(params);

    // Berikan respon sukses
    return res.json(apiResponse("Successfully updated project", 200, "Success", item));
  } catch (error: any) {
    console.error(error);

    // Tangani error dengan format respons yang konsisten
    const errorMessage = error.message || "An unexpected error occurred";
    const statusCode = errorMessage.includes("not found") ? 404 : 400;
    return res.status(statusCode).json({
      status: false,
      error: errorMessage,
    });
  }
};

export { getAllProject, createProject, deleteProject, updateProject }
