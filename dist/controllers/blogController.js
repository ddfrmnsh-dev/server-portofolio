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
exports.updateStatus = exports.viewBlog = exports.getAllBlog = exports.createBlog = void 0;
const blogService = __importStar(require("../services/blogService"));
const slug_1 = __importDefault(require("slug"));
//create blog function
const createBlog = async (req, res) => {
    try {
        const { title, description, content } = req.body;
        //get id author from session
        const authorId = req.session.user.id;
        //looping array category
        const category = [];
        for (let i = 0; i < req.body.category.length; i++) {
            let slugs = (0, slug_1.default)(req.body.category[i]);
            let names = req.body.category[i];
            let myObject = {
                name: names,
                slug: slugs,
            };
            // category.push(req.body.category[i]);
            category.push(myObject);
        }
        // console.log("cek req blog", category);
        if (!req.file) {
            req.flash("alertMessage", "Failed to upload image is mandatory");
            req.flash("alertTitle", "Failed");
            req.flash("alertStatus", "red");
            return res.redirect("/admin/blog");
        }
        // //create slug from category
        // // const slugCategory = slug(category);
        const slugTitle = (0, slug_1.default)(title);
        const newImg = `images/${req.file.filename}`;
        const checkSlug = await blogService.checkSlug(slugTitle);
        const checkCategory = await blogService.findOrCreateCategories(category);
        console.log("cek data", checkCategory);
        if (checkSlug) {
            return res.status(400).json({ message: "Slug telah digunakan" });
        }
        let params = {
            authorId: authorId,
            title: title,
            slug: slugTitle,
            description: description,
            content: content,
            published: false,
            categories: checkCategory,
        };
        const project = await blogService.createPost(params);
        req.flash("alertMessage", "Successfully add new Article");
        req.flash("alertTitle", "Success");
        req.flash("alertStatus", "green");
        console.log("data", project);
        return res.redirect("/admin/blog");
        // return res.status(201).json(project);
    }
    catch (error) {
        console.error(error);
        return error;
    }
};
exports.createBlog = createBlog;
const getAllBlog = async (req, res) => {
    try {
        const blogs = await blogService.getAllPost();
        // if (!blogs) {
        //   return res.status(404).json({ message: "Blog not found" });
        // }
        return res.json({
            message: "success",
            data: blogs,
        });
    }
    catch (error) {
        console.error(error);
        return error;
    }
};
exports.getAllBlog = getAllBlog;
const viewBlog = async (req, res) => {
    try {
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alertTitle = req.flash("alertTitle");
        const alert = {
            message: alertMessage,
            status: alertStatus,
            title: alertTitle,
        };
        const getBlog = await blogService.getAllPost();
        if (!getBlog) {
            return res.status(404).json({ message: "Project not found" });
        }
        // getBlog.map((val, idx, []) => {
        //   val.content = val.content.substring(0, 150);
        // });
        // if (getBlog instanceof Array) {
        //   getBlog.map((val, idx, []) => {
        //     val.content = sanitizeHtml(val.content, {
        //       allowedTags: [],
        //       allowedAttributes: {},
        //     });
        //   });
        // }
        return res.render("pages/blog/index", {
            layout: "layouts/main-layout",
            title: "Blog",
            alert,
            data: getBlog,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.viewBlog = viewBlog;
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const parseId = parseInt(id);
        const checkStatus = await blogService.findById(parseId);
        if (!checkStatus) {
            return res.status(404).json({ message: "Blog not found" });
        }
        // console.log("cek status 1", checkStatus);
        const status = checkStatus.published;
        // const newStatus = !status;
        if (!status) {
            await blogService.updateStatus(parseId, true);
        }
        else {
            await blogService.updateStatus(parseId, false);
        }
        // console.log("cek status 2", newStatus);
        return res.redirect("/admin/blog");
        // return res.status(404).json({ message: "success", newStatus });
    }
    catch (e) {
        return res.status(404).json({ message: "Blog not found" });
    }
};
exports.updateStatus = updateStatus;
