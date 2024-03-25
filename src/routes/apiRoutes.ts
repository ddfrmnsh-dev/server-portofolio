import express, { Request, Response } from "express";
import * as projectController from "../controllers/projectController";
import * as blogController from "../controllers/blogController";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/v1/project", projectController.getAllProject);
router.post("/v1/blog", blogController.createBlog);

export default router;
