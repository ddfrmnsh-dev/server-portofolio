import { Request, Response } from "express";
import * as blogService from "../services/blogService";
import slug from "slug";
import fs from "fs-extra";
import path from "path";
import sanitizeHtml from "sanitize-html";
import { Project } from "@prisma/client";

//create blog function
const createBlog = async (req: Request, res: Response) => {
  try {
    //get id author from session
    const { title, description, content } = req.body;
    const authorId = req.session.user.id;

    //looping array category
    const category = [];
    for (let i = 0; i < req.body.category.length; i++) {
      category.push(req.body.category[i]);
    }

    if (!req.file) {
      req.flash("alertMessage", "Failed to upload image is mandatory");
      req.flash("alertTitle", "Failed");
      req.flash("alertStatus", "red");
      return res.redirect("/admin/blog");
    }

    //create slug from category

    const slugCategory = slug(category);
    const slugTitle = slug(title);
    const newImg = `images/${req.file.filename}`;
    const checkSlug = await blogService.checkSlug(slugTitle);

    if (checkSlug) {
      return res.status(400).json({ message: "Slug telah digunakan" });
    }

    let params = {
      authorId: authorId,
      title: title,
      slug: slugTitle,
      description: description,
      path_img: newImg,
      content: content,
      published: false,
      category: "blog",
      categorySlug: "blog",
    };

    const project = await blogService.createPost(params);
    return res.status(201).json(project);
  } catch (error) {
    console.error(error);
    return error;
  }
};

export { createBlog };
