"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProject = exports.deleteProject = exports.updateProject = exports.createProject = exports.viewProject = void 0;
const projectService = __importStar(require("../services/projectService"));
const slug_1 = __importDefault(require("slug"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const getAllProject = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        return error;
    }
};
exports.getAllProject = getAllProject;
const viewProject = async (req, res) => {
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
                val.description = (0, sanitize_html_1.default)(val.description, {
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.viewProject = viewProject;
const createProject = async (req, res) => {
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
        let slugs = (0, slug_1.default)(name);
        let params = {
            name: name,
            description: description,
            image: newImg,
            slug: slugs,
        };
        const project = await projectService.createProject(params);
        req.flash("alertMessage", "Successfully add new project");
        req.flash("alertTitle", "Success");
        req.flash("alertStatus", "green");
        console.log("data", project);
        return res.redirect("/admin/project");
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    const { id, name, description, link } = req.body;
    let ids = parseInt(id);
    try {
        const project = await projectService.getProjectById(ids);
        if (req.file == undefined) {
            let slugs = (0, slug_1.default)(name);
            let params = {
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
        }
        else {
            await fs_extra_1.default.unlink(path_1.default.join(`public/${project.path_img}`));
            let newImg = `images/${req.file.filename}`;
            let slugs = (0, slug_1.default)(name);
            let params = {
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
    }
    catch (error) {
        req.flash("alertMessage", error.message);
        req.flash("alertTitle", "Failed");
        req.flash("alertStatus", "red");
        console.error(error);
        res.redirect("/admin/project");
        // return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Id tidak ditemukan");
        }
        let params = parseInt(id);
        const item = await projectService.getProjectById(params);
        await fs_extra_1.default.unlink(path_1.default.join(`public/${item.path_img}`), (err) => {
            if (err) {
                throw new Error("Failed to delete image");
            }
        });
        await projectService.deleteProject(params);
        req.flash("alertMessage", "Successfully delete project");
        req.flash("alertTitle", "Delete");
        req.flash("alertStatus", "red");
        return res.redirect("/admin/project");
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.deleteProject = deleteProject;
