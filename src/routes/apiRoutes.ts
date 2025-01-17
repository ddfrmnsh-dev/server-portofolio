import express, { Request, Response } from "express";
import * as projectController from "../controllers/projectController";
import * as authController from "../controllers/authController";
import * as blogController from "../controllers/blogController";
import * as apiProjectController from "../controllers/api/projectController";
import * as apiBlogController from "../controllers/api/blogController";
import * as apiUserController from "../controllers/api/userController";
import dotenv from "dotenv";
import authMiddleware from "../middleware/authMiddleware";
import rateLimiter from "../middleware/rateLimiter";
import upload from "../middleware/multerUpload";
dotenv.config();

const router = express.Router();

//API-AUTH
router.post("/auth/adminSigninEnc", rateLimiter.limiter, authController.userLogin);
router.post("/testDes", authController.decryptTest);

//API-PROJECT
router.get("/v1/project", apiProjectController.getAllProject);
router.get("/v1/project/:id", apiProjectController.getAllProject);
router.post("/v1/project", upload("images").single("img"), authMiddleware.authMiddlewares, apiProjectController.createProject);
router.put("/v1/project/:id", upload("images").single("img"),authMiddleware.authMiddlewares, apiProjectController.updateProject);
router.delete("/v1/project/:id", authMiddleware.authMiddlewares, apiProjectController.deleteProject);

//API-BLOG
router.get("/v1/blog", apiBlogController.getAllBlog);
router.get("/v1/blog/:id", apiBlogController.getAllBlog);
router.post("/v1/blog", authMiddleware.authMiddlewares, blogController.createBlog);
router.put("/v1/blog/:id", authMiddleware.authMiddlewares, blogController.updateStatus);
router.post("/v1/blog/:slug", authMiddleware.authMiddlewares, apiBlogController.getSingleBlog);

//API-USER
router.get("/v1/users", authMiddleware.authMiddlewares, apiUserController.getAllUser);
router.post("/v1/user", apiUserController.createUser);

//API-CLIENT
router.get("/v1/client", apiProjectController.getAllProject);
router.get("/v1/client/:id", apiProjectController.getAllProject);
router.post("/v1/client", authMiddleware.authMiddlewares, apiProjectController.getAllProject);
router.put("/v1/client/:id", authMiddleware.authMiddlewares, apiProjectController.getAllProject);
router.delete("/v1/client/:id", authMiddleware.authMiddlewares, apiProjectController.getAllProject);

export default router;
