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

    if (!blogs) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const data: any = {
      articles :blogs,
      total: totalPosts,
      page: page,
      limit: limit,
    };

    return res.json(apiResponse("Get all Articles", 200, "Success", data));
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

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, content, status, category } = req.body;
    const authorId = req.decoded.id;
    const image = req.files as Express.Multer.File[];
    const author = parseInt(authorId);
    const parseCategory = JSON.parse(category);

    const params: any = {
      title,
      slug: slug(title),
      description,
      content,
      authorId: author,
      image,
      status,
      category: parseCategory
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
    const { title, description, content, status, removeCategory, addCategory, removeImage } = req.body;
    const authorId = req.decoded.id;
    const image = req.files as Express.Multer.File[];
    const author = parseInt(authorId);
    const idPost = parseInt(req.params.id);
    const statusPost = parseInt(status);

    console.log("params img:", image);
    const params: any = {
      idPost: idPost,
      title,
      slug: slug(title),
      description,
      content,
      authorId: author,
      status: statusPost,
    }

    if (addCategory) {
      try {
        params.addCategory = Array.isArray(addCategory)
          ? addCategory : JSON.parse(addCategory);
      } catch (error) {
        console.log("Error parsing addCategory:", error);
        params.addCategory = [];
      }
    }

    if (removeCategory) {
      try {
        params.removeCategory = Array.isArray(removeCategory)
          ? removeCategory
          : JSON.parse(removeCategory); 
      } catch (error) {
        console.error("Error parsing removeCategory:", error);
        params.removeCategory = [];
      }
    }
    
    

    if (removeImage && removeImage.length > 0) {
      try {
        console.log("removeImage:", removeImage);
        params.removeImage = Array.isArray(removeImage)
          ? removeImage
          : JSON.parse(removeImage); 
      } catch (error) {
        console.error("Error parsing remove img:", error);
        params.removeImage = [];
      }
    }

    // if(image && image.length > 0) {
    //   params.addImage = image;
    //   console.log("Check Image", params.addImage);
    // }

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

const getAllCategory = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await blogService.getAllCatgory();
  
    return res.json(apiResponse("Get all categories", 200, "Success", data));
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

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await blogService.findById(postId);

    if (!post) {
      return res.status(404).json({  status: false, message: "Post not found" });
    }

    return res.json(apiResponse("Get post by ID", 200, "Success", post));
  } catch (error: any) {
    const errorMessage = error.message || 'An unexpected error occurred';

    if(errorMessage) {
      res.status(400).json({ status: false, error: errorMessage });
    } else {
      res.status(500).json({ status: false, error: 'Internal server error'});
    }
  }
}

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await blogService.deleteBlog(postId);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }
    return res.json(apiResponse("Delete post", 200, "Success", post));
    
  } catch (error: any) {
    const errorMessage = error.message || 'An unexpected error occurred';
    if(errorMessage) {
      res.status(400).json({ status: false, error: errorMessage });
    } else {
      res.status(500).json({ status: false, error: 'Internal server error'});
    }
  }
}

export { getSingleBlog, getAllBlog, createPost, updateBlog, getAllCategory, getPostById, deletePost };
