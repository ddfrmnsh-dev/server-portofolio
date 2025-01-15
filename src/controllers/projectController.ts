import { Request, Response } from "express";
import * as projectService from "../services/projectService";
import * as clientService from "../services/clientService";
import slug from "slug";
import fs from "fs-extra";
import path from "path";
import sanitizeHtml from "sanitize-html";
import { Project } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const viewProject = async (req: Request, res: Response) => {
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alertTitle = req.flash("alertTitle");
    const alert = {
      message: alertMessage,
      status: alertStatus,
      title: alertTitle,
    };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const order = req.query.order || "asc";
    const offset = (page - 1) * limit;
    const getProject = await projectService.getAllProjects(limit, offset, order);
    const getClient = await clientService.getAllClient();
    const totalProjects: any = await projectService.countProjects();
    const totalPages = Math.ceil(totalProjects / limit);

    if (!getProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (getProject instanceof Array) {
      getProject.map((val, idx, []) => {
        val.description = sanitizeHtml(val.description, {
          allowedTags: [],
          allowedAttributes: {},
        });
      });
    }
    return res.render("pages/project/index", {
      layout: "layouts/main-layout",
      title: "Project",
      alert,
      user: req.decoded,
      data: getProject,
      dataClient: getClient,
      total: totalPages,
      page: page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, link, client } = req.body;
    const clientId = parseInt(client);
    const id = req.decoded.id;
    const slugs = slug(name);
    const files = req.files as Express.Multer.File[];
    // console.log("cek file", files);
    if (!req.files) {
      // throw new Error("File tidak ditemukan")
      req.flash("alertMessage", "Failed to upload image is mandatory");
      req.flash("alertTitle", "Failed");
      req.flash("alertStatus", "red");
      return res.redirect("/admin/project");
    }

    // console.log("cek", req.body);
    // let newImg = `images/${files}`;
    let params: any = {
      name: name,
      description: description,
      slug: slugs,
      clientId: clientId,
      userId: id,
      files: files,
      link: link,
    };
    const project = await projectService.createProject(params);

    req.flash("alertMessage", "Successfully add new project");
    req.flash("alertTitle", "Success");
    req.flash("alertStatus", "green");
    console.log("data", project);
    return res.redirect("/admin/project");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProject = async (req: Request, res: Response) => {
  const { id, name, description, link, client } = req.body;
  let ids = parseInt(id);
  const clientId = parseInt(client);
  try {
    const project: any = await projectService.getProjectById(ids);
    if (req.file == undefined) {
      let slugs = slug(name);
      let params: any = {
        id: ids,
        name: name,
        description: description,
        link: link,
        slug: slugs,
        client: clientId || project.clientId,
      };

      try {
        await projectService.updateProject(params);
        req.flash("alertMessage", "Successfully update project without image");
        req.flash("alertTitle", "Success");
        req.flash("alertStatus", "green");
      } catch (error) {
        req.flash("alertMessage", `${error}`);
        req.flash("alertTitle", "Failed");
        req.flash("alertStatus", "red");
        return res.redirect("/admin/project");
      }
    } else {
      await fs.unlink(path.join(`public/${project.path_img}`));
      let newImg = `images/${req.file.filename}`;
      let slugs = slug(name);
      let params: any = {
        id: ids,
        name: name,
        description: description,
        image: newImg,
        link: link,
        slug: slugs,
        client: clientId,
      };
      await projectService.updateProject(params);
      req.flash("alertMessage", "Successfully update project");
      req.flash("alertTitle", "Success");
      req.flash("alertStatus", "green");
    }
    return res.redirect("/admin/project");
  } catch (error: any) {
    console.error(error);
    req.flash("alertMessage", error.message);
    req.flash("alertTitle", "Failed");
    req.flash("alertStatus", "red");
    res.redirect("/admin/project");
  }
};

const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Id tidak ditemukan");
    }
    let params = parseInt(id);
    const item: any = await projectService.getProjectById(params);
    try {
      await fs.unlink(path.join(`public/${item.path_img}`));
    } catch (error: any) {
      console.error("Failed to delete image:", error.message);
    }

    await projectService.deleteProjects(params);
    req.flash("alertMessage", "Successfully delete project");
    req.flash("alertTitle", "Delete");
    req.flash("alertStatus", "red");
    return res.redirect("/admin/project");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { viewProject, createProject, updateProject, deleteProject };
