import express, { Request, Response } from "express";
import * as projectController from "../controllers/projectController";
import * as authController from "../controllers/authController";
import * as blogController from "../controllers/blogController";
import * as apiProjectController from "../controllers/api/projectController";
import * as apiBlogController from "../controllers/api/blogController";
import * as apiUserController from "../controllers/api/userController";
import * as apiClientController from "../controllers/api/clientController";
import dotenv from "dotenv";
import authMiddleware from "../middleware/authMiddleware";
import rateLimiter from "../middleware/rateLimiter";
import upload from "../middleware/multerUpload";
dotenv.config();

const router = express.Router();

//API-AUTH
router.post("/auth/adminSigninEnc", rateLimiter.limiter, authController.userLogin);
router.post("/testDes", authController.decryptTest);

//API-PROJECT-DONE
router.get("/v1/project", apiProjectController.getAllProject);
router.get("/v1/project/:id", apiProjectController.getProjectById);
router.post("/v1/project", upload("images").single("img"), authMiddleware.authMiddlewares, apiProjectController.createProject);
router.put("/v1/project/:id", upload("images").single("img"),authMiddleware.authMiddlewares, apiProjectController.updateProject);
router.delete("/v1/project/:id", authMiddleware.authMiddlewares, apiProjectController.deleteProject);

//API-BLOG
router.get("/v1/blog", apiBlogController.getAllBlog); //done
// router.get("/v1/blog/:id", apiBlogController.getAllBlog); //done
router.post("/v1/blog", authMiddleware.authMiddlewares, upload("images").array("img"), apiBlogController.createBlog); //done
router.put("/v1/blog/:id", authMiddleware.authMiddlewares, upload("images").array("img"), apiBlogController.updateBlog); //done
router.get("/v1/blog/:slug", apiBlogController.getSingleBlog);

//API-USER
router.get("/v1/users", authMiddleware.authMiddlewares, apiUserController.getAllUser);
router.post("/v1/user", apiUserController.createUser);
router.delete("/v1/user/:id", authMiddleware.authMiddlewares, apiUserController.deleteUser);

//API-CLIENT
router.get("/v1/client", apiClientController.getAllClient); //done
router.get("/v1/client/:id", apiClientController.getClientById); //done
router.post("/v1/client", authMiddleware.authMiddlewares, upload("images").single("img"), apiClientController.createClient); //done
router.put("/v1/client/:id", authMiddleware.authMiddlewares, upload("images").single("img"), apiClientController.updateClient); //done
router.delete("/v1/client/:id", authMiddleware.authMiddlewares, apiClientController.deleteClient); //done

export default router;
