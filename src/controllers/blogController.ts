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
    const { title, description, content, image } = req.body;
    // const authorId = req.session.user.id;
    const authorId = req.body

    //looping array category
    // const category = [];
    // for (let i = 0; i < req.body.category.length; i++) {
    //   category.push(req.body.category[i]);
    // }

    // if (!req.file) {
    //   req.flash("alertMessage", "Failed to upload image is mandatory");
    //   req.flash("alertTitle", "Failed");
    //   req.flash("alertStatus", "red");
    //   return res.redirect("/admin/blog");
    // }

    //create slug from category

    // const slugCategory = slug(category);
    const slugTitle = slug(title);
    // const newImg = `images/${req.file.filename}`;
    const checkSlug = await blogService.checkSlug(slugTitle);

    if (checkSlug) {
      return res.status(400).json({ message: "Slug telah digunakan" });
    }

    let params = {
      authorId: 1,
      title: title,
      slug: slugTitle,
      description: description,
      path_img: image,
      content: content,
      published: false,
      categories: [
        {
          name: "category1",
          slug: "blog1"
        },
        {
          name: "category2",
          slug: "blog2"
        },
        {
          name: "category3",
          slug: "blog3"
        }
      ]
    };

    const project = await blogService.createPost(params);
    return res.status(201).json(project);
  } catch (error) {
    console.error(error);
    return error;
  }
};


const getAllBlog = async (req: Request, res: Response) => {
  try {
    const blogs = await blogService.getAllPost();
    // if (!blogs) {
    //   return res.status(404).json({ message: "Blog not found" });
    // }
    return res.json({
      message: "success",
      data: blogs,
    });
  } catch (error) {
    console.error(error);
    return error;
  }
}
export { createBlog, getAllBlog };
