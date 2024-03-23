import { Request, Response } from "express";
import * as projectService from "../services/projectService";
import slug from "slug";
import moment from "moment";
import fs from 'fs-extra';
import path from 'path';
import { Project } from "@prisma/client";
const viewProject = async (req: Request, res: Response) => {
    try {
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alertTitle = req.flash("alertTitle");
        const alert = { message: alertMessage, status: alertStatus, title: alertTitle };

        const getProject = await projectService.getAllProject();
        return res.render('pages/project/index', { layout: 'layouts/main-layout', title: 'Project', alert, data: getProject })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const createProject = async (req: Request, res: Response) => {
    try {
        const { name, description, link } = req.body;

        if (!req.file) {
            // throw new Error("File tidak ditemukan")
            req.flash('alertMessage', 'Failed to upload image is mandatory');
            req.flash('alertTitle', 'Failed');
            req.flash('alertStatus', 'red');
            return res.redirect('/admin/project');
        }

        console.log("data", req.file)
        let newImg = `images/${req.file.filename}`;
        let slugs = slug(name)
        let params: any = {
            name: name,
            description: description,
            image: newImg,
            link: link,
            slug: slugs
        }
        const project = await projectService.createProject(params);

        req.flash('alertMessage', 'Successfully add new project');
        req.flash('alertTitle', 'Success');
        req.flash('alertStatus', 'green');
        console.log("data", project)
        return res.redirect('/admin/project');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const editProject = async (req: Request, res: Response) => {
    const { id, name, description, link } = req.body;
    try {
        const project = await projectService.getProjectById(id);
        if (req.file == undefined) {
            let slugs = slug(name)
            let params: any = {
                id: id,
                name: name,
                description: description,
                link: link,
                slug: slugs
            }
            await projectService.updateProject(params);
            req.flash('alertMessage', 'Successfully update project without image');
            req.flash('alertTitle', 'Success');
            req.flash('alertStatus', 'green');
        } else {
            let newImg = `images/${req.file.filename}`;
            let slugs = slug(name)
            let params: any = {
                id: id,
                name: name,
                description: description,
                image: newImg,
                link: link,
                slug: slugs
            }
            await projectService.updateProject(params);
            req.flash('alertMessage', 'Successfully update project');
            req.flash('alertTitle', 'Success');
            req.flash('alertStatus', 'red');
        }
        return res.redirect('/admin/project');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Id tidak ditemukan")
        }
        let params = parseInt(id);
        const item: any = await projectService.getProjectById(params);

        await fs.unlink(path.join(`public/${item.path_img}`), (err) => {
            if (err) {
                throw new Error("Failed to delete image")
            }
        })

        await projectService.deleteProject(params);
        req.flash('alertMessage', 'Successfully delete project');
        req.flash('alertTitle', 'Delete');
        req.flash('alertStatus', 'red');
        return res.redirect('/admin/project');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export {
    viewProject,
    createProject,
    editProject,
    deleteProject
}