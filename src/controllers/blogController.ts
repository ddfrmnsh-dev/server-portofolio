import { Request, Response } from "express";
import * as blogService from "../services/blogService";
import slug from "slug";
import fs from "fs-extra";
import path from "path";
import sanitizeHtml from "sanitize-html";
import { Post } from "@prisma/client";

//create blog function
const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, description, content } = req.body;
    //get id author from session
    const authorId = req.decoded.id;
    const files = req.files as Express.Multer.File[];
    console.log("cek content", content);

    if (!req.files) {
      // throw new Error("File tidak ditemukan")
      req.flash("alertMessage", "Failed to upload image is mandatory");
      req.flash("alertTitle", "Failed");
      req.flash("alertStatus", "red");
      return res.redirect("/admin/blog");
    }
    //looping array category
    const category = [];
    for (let i = 0; i < req.body.category.length; i++) {
      let slugs = slug(req.body.category[i]);
      let names = req.body.category[i];
      let myObject = {
        name: names,
        slug: slugs,
      };
      // category.push(req.body.category[i]);
      category.push(myObject);
    }

    // console.log("cek req blog", category);

    // //create slug from category

    // // const slugCategory = slug(category);
    const slugTitle = slug(title);
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
      files: files,
    };

    const project = await blogService.createPost(params);
    req.flash("alertMessage", "Successfully add new Article");
    req.flash("alertTitle", "Success");
    req.flash("alertStatus", "green");
    console.log("data", project);
    return res.redirect("/admin/blog");
    // return res.status(201).json(project);
  } catch (error) {
    console.error(error);
    return error;
  }
};

const uploadImage = async (req: Request, res: Response) => {
  const files = req.file;

  if (!files) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `http://localhost:3000/article/${files.filename}`;

  res.json({
    message: "File uploaded successfully",
    file: { url: fileUrl, title: files.originalname },
  });
};

const viewBlog = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parseId = parseInt(id);
    const checkStatus: any = await blogService.findById(parseId);
    if (!checkStatus) {
      return res.status(404).json({ message: "Blog not found" });
    }
    // console.log("cek status 1", checkStatus);
    const status = checkStatus.published;
    // const newStatus = !status;
    if (!status) {
      await blogService.updateStatus(parseId, true);
    } else {
      await blogService.updateStatus(parseId, false);
    }
    // console.log("cek status 2", newStatus);
    return res.redirect("/admin/blog");
    // return res.status(404).json({ message: "success", newStatus });
  } catch (e) {
    return res.status(404).json({ message: "Blog not found" });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Id tidak ditemukan");
    }
    let params = parseInt(id);
    const item: any = await blogService.findById(params);

    // console.log("cek item delete", item.image[0].path_img);
    if (item.image) {
      await fs.unlink(path.join(`public/${item.image[0].path_img}`), (err) => {
        if (err) {
          throw new Error("Failed to delete image");
        }
      });
    }

    await blogService.deleteBlog(params);
    req.flash("alertMessage", "Successfully delete blog");
    req.flash("alertTitle", "Delete");
    req.flash("alertStatus", "red");
    return res.redirect("/admin/blog");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export {
  createBlog,
  viewBlog,
  updateStatus,
  deleteBlog,
  uploadImage,
};
