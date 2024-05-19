import express, { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

import authMiddleware from "../middleware/authMiddleware";
// import storage from "../middleware/multerUpload";
import * as adminController from "../controllers/adminController";
import * as projectController from "../controllers/projectController";
import * as blogController from "../controllers/blogController";
import * as dashboardController from "../controllers/dashboardController";
import * as clientController from "../controllers/clientController";
import dotenv from "dotenv";
import upload from "../middleware/multerUpload";
dotenv.config();

const router = express.Router();

router.get("/signin", adminController.viewSignin);
router.post("/signin", adminController.adminLogin);
router.get("/logout", adminController.adminLogout);

router.get(
  "/dashboard",
  authMiddleware.isAuthenticated,
  dashboardController.viewDashboard
);

/*
Route-project
*/
router.get(
  "/project",
  authMiddleware.isAuthenticated,
  projectController.viewProject
);
router.put(
  "/project",
  upload("images").single("img"),
  authMiddleware.isAuthenticated,
  projectController.updateProject
);
router.delete("/project/:id", projectController.deleteProject);
router.post(
  "/project",
  upload("images").array("img"),
  authMiddleware.isAuthenticated,
  projectController.createProject
);

/*
Route-blog
*/
router.get("/blog", authMiddleware.isAuthenticated, blogController.viewBlog);
router.post(
  "/blog",
  upload("images").single("img"),
  authMiddleware.isAuthenticated,
  blogController.createBlog
);
router.put(
  "/updateStatus/:id",
  authMiddleware.isAuthenticated,
  blogController.updateStatus
);

/*
Route-client
*/
router.post(
  "/client",
  upload("images").single("img"),
  authMiddleware.isAuthenticated,
  clientController.postClient
);

router.get(
  "/client",
  authMiddleware.isAuthenticated,
  clientController.viewClient
);
router.put(
  "/client",
  upload("images").single("img"),
  authMiddleware.isAuthenticated,
  clientController.updateClient
);
router.delete(
  "/client/:id",
  authMiddleware.isAuthenticated,
  clientController.deleteClient
);

export default router;
