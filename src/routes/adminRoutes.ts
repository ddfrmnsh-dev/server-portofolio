import express, { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

import authMiddleware from "../middleware/authMiddleware";
// import storage from "../middleware/multerUpload";
import * as adminController from "../controllers/adminController";
import * as projectController from "../controllers/projectController";
import * as blogController from "../controllers/blogController";
import dotenv from "dotenv";
import upload from "../middleware/multerUpload";
dotenv.config();

const router = express.Router();

router.get("/signin", adminController.viewSignin);
router.post("/signin", adminController.adminLogin);
router.get("/logout", adminController.adminLogout);

router.get('/dashboard', authMiddleware.isAuthenticated, adminController.viewDashboard);

/*
Route-project
*/
router.get("/project", authMiddleware.isAuthenticated, projectController.viewProject);
router.put(
    "/project",
    upload("images").single("img"), authMiddleware.isAuthenticated,
    projectController.updateProject
);
router.delete("/project/:id", projectController.deleteProject);
router.post(
    "/project",
    upload("images").single("img"), authMiddleware.isAuthenticated,
    projectController.createProject
);

/*
Route-blog
*/
router.get("/blog", authMiddleware.isAuthenticated, blogController.viewBlog);
router.post("/blog", upload("images").single("img"), authMiddleware.isAuthenticated, blogController.createBlog);
router.put("/updateStatus/:id", authMiddleware.isAuthenticated, blogController.updateStatus);

export default router;
