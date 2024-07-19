import express, { Request, Response } from "express";
import * as projectController from "../controllers/projectController";
import * as blogController from "../controllers/blogController";
import * as apiBlogController from "../controllers/api/blogController";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/v1/project", projectController.getAllProject);
router.post("/v1/blog", blogController.createBlog);
router.get("/v1/blog", apiBlogController.getAllBlog);
router.put("/v1/updateBlog/:id", blogController.updateStatus);
router.post("/v1/blog/:slug", apiBlogController.getSingleBlog);

export default router;
