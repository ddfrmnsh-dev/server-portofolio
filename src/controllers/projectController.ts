import { Request, Response } from "express";
import * as projectService from "../services/projectService";
import slug from "slug";
import fs from "fs-extra";
import path from "path";
import sanitizeHtml from "sanitize-html";
import { Project } from "@prisma/client";

const getAllProject = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getAllProject();

    if (!projects) {
      return res.status(404).json({ message: "Project not found" });
    }

    // if (projects instanceof Array) {
    //     projects.map((val, idx, []) => {
    //         val.description = sanitizeHtml(val.description, {
    //             allowedTags: [],
    //             allowedAttributes: {},
    //         });
    //     });
    // }

    // console.log("cek data", projects);

    return res.json({
      message: "success",
      data: projects,
    });
  } catch (error) {
    console.error(error);
    return error;
  }
};

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

    const getProject = await projectService.getAllProject();
    // console.log("cek sess", req.session.user.id);
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
      data: getProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, link } = req.body;
    console.log("cek req project", req.body);
    if (!req.file) {
      // throw new Error("File tidak ditemukan")
      req.flash("alertMessage", "Failed to upload image is mandatory");
      req.flash("alertTitle", "Failed");
      req.flash("alertStatus", "red");
      return res.redirect("/admin/project");
    }

    console.log("data", req.file);
    let newImg = `images/${req.file.filename}`;
    let slugs = slug(name);
    let params: any = {
      name: name,
      description: description,
      image: newImg,
      link: link,
      slug: slugs,
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
  const { id, name, description, link } = req.body;
  let ids = parseInt(id);
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
      };
      await projectService.updateProject(params);
      req.flash("alertMessage", "Successfully update project without image");
      req.flash("alertTitle", "Success");
      req.flash("alertStatus", "green");
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
      };
      await projectService.updateProject(params);
      req.flash("alertMessage", "Successfully update project");
      req.flash("alertTitle", "Success");
      req.flash("alertStatus", "green");
    }
    return res.redirect("/admin/project");
  } catch (error: any) {
    req.flash("alertMessage", error.message);
    req.flash("alertTitle", "Failed");
    req.flash("alertStatus", "red");
    console.error(error);
    res.redirect("/admin/project");
    // return res.status(500).json({ error: "Internal Server Error" });
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

    await fs.unlink(path.join(`public/${item.path_img}`), (err) => {
      if (err) {
        throw new Error("Failed to delete image");
      }
    });

    await projectService.deleteProject(params);
    req.flash("alertMessage", "Successfully delete project");
    req.flash("alertTitle", "Delete");
    req.flash("alertStatus", "red");
    return res.redirect("/admin/project");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  viewProject,
  createProject,
  updateProject,
  deleteProject,
  getAllProject,
};
