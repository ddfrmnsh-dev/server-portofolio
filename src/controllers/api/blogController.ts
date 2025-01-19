import { Request, Response, NextFunction } from "express";
import * as blogService from "../../services/blogService";
import { apiResponse } from "../../utils/responseApi";
import slug from "slug";
const getAllBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10
    const order = (req.query.order as string) || "asc";
    const offset = (page - 1) * limit;
    
    const blogs = await blogService.getAllPosts(limit, offset, order);

    const totalPosts: any = await blogService.countPost();
    if (totalPosts === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const totalPages = Math.ceil(totalPosts / limit);

    if (!blogs) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const data: any = {
      blogs,
      total: totalPages,
      page: page,
      limit: limit,
    };

    return res.json(apiResponse("Get all Blogs", 200, "Success", data));
  } catch (error: any) {
    const errorMessage = error.message || 'An unexpected error occurred';

    console.log("err:",errorMessage);

    if(errorMessage) {
        res.status(400).json({ status: false, error: errorMessage });
    } else {
        res.status(500).json({ status: false, error: 'Internal server error'});
    }
  }
};

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, content, published, category } = req.body;
    const authorId = req.decoded.id;
    const image = req.files as Express.Multer.File[];
    const author = parseInt(authorId);

    const params: any = {
      title,
      slug: slug(title),
      description,
      content,
      authorId: author,
      image,
      status: published,
      category
    }

    const blog = await blogService.createPosts(params);
    return res.json(apiResponse("Create Blog", 200, "Success", blog));
  } catch (error:any) {
    const errorMessage = error.message || 'An unexpected error occurred';

    console.log("err:",errorMessage);

    if(errorMessage) {
        res.status(400).json({ status: false, error: errorMessage });
    } else {
        res.status(500).json({ status: false, error: 'Internal server error'});
    }
  }
}

const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, content, published, removeCategory, addCategory, removeImg } = req.body;
    const authorId = req.decoded.id;
    const image = req.files as Express.Multer.File[];
    const author = parseInt(authorId);
    const idPost = parseInt(id);

    const params: any = {
      idPost: idPost,
      title,
      slug: slug(title),
      description,
      content,
      authorId: author,
      status: published,
    }

    if (addCategory && addCategory.length > 0) {
      params.addCategory = addCategory;
    }

    if (removeCategory && removeCategory.length > 0) {
      params.removeCategory = removeCategory.map((category:any) => parseInt(category, 10));
    }

    if (removeImg && removeImg.length > 0) {
      params.removeImage = removeImg.map((img:any) => parseInt(img, 10)); 
    }

    if(image && image.length > 0) {
      params.addImage = image;
      console.log("Check Image", params.addImage);
    }

    const blog = await blogService.updatePosts(params);

    return res.json(apiResponse("Successfully updated blog", 200, "Success", blog));
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

const getSingleBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postSlug = req.params.slug;

    // console.log("Check Slugs BE", postSlug);

    const data = await blogService.findBySlug(postSlug);

    return res.json(apiResponse("Get single Blog", 200, "Success", data));

    // return res.json({
    //   message: "Success",
    //   data: blog,
    // });
  } catch (error) {
    console.log("Error", error);
    next(error);
  }
};

export { getSingleBlog, getAllBlog, createBlog, updateBlog };
