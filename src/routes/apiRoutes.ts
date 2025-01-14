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
dotenv.config();

const router = express.Router();

//API-CMS
router.post("/auth/adminSigninEnc", rateLimiter.limiter, authController.userLogin);
router.post("/testDes", authController.decryptTest);

//API-PROJECT
router.get("/v1/project", apiProjectController.getAllProject);

//API-BLOG
router.post("/v1/blog", blogController.createBlog);
router.get("/v1/blog", apiBlogController.getAllBlog);
router.put("/v1/updateBlog/:id", blogController.updateStatus);
router.post("/v1/blog/:slug", apiBlogController.getSingleBlog);

//API-USER
router.get("/v1/users", authMiddleware.authMiddlewares, apiUserController.getAllUser);
router.post("/v1/user", authMiddleware.authMiddlewares, apiUserController.createUser);

export default router;
