import { Request, Response, NextFunction } from "express";
import * as blogService from "../../services/blogService";
import { apiResponse } from "../../utils/responseApi"
const getAllBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        // const blogs = await blogService.getAllPostAPI();
        const blogs = await blogService.getAllPostAPI(limit, offset);

        const totalPosts: any = await blogService.countPost();
        if (totalPosts === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const totalPages = Math.ceil(totalPosts / limit);

        console.log("cek total page", totalPages);
        console.log("cek total post", totalPosts);
        console.log("cek total limit", totalPosts);
        // console.log("cek data", blogs);
        if (!blogs) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const data: any = {
            blogs,
            total: totalPages,
            page: page,
            limit: limit,
        }

        return res.json(apiResponse("Get all Blogs", 200, "Success", data));
        // return res.json({
        //     message: "success",
        //     data: blogs,
        // meta: {
        //     total: totalPages,
        //     page: page,
        //     limit: limit,
        // },
        // });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getSingleBlog = async (req: Request, res: Response) => {
    try {
        const postSlug = req.params.slug;

        console.log("Check Slugs BE", postSlug);

        const blog = await blogService.findBySlug(postSlug);

        return res.json({
            message: "Success",
            data: blog,
        });
    } catch (error) {
        console.log("Error", error);
        return error;
    }
};

export {
    getSingleBlog,
    getAllBlog
};