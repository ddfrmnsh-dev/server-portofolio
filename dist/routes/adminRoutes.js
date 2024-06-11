"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
// import storage from "../middleware/multerUpload";
const adminController = __importStar(require("../controllers/adminController"));
const projectController = __importStar(require("../controllers/projectController"));
const blogController = __importStar(require("../controllers/blogController"));
const dashboardController = __importStar(require("../controllers/dashboardController"));
const dotenv_1 = __importDefault(require("dotenv"));
const multerUpload_1 = __importDefault(require("../middleware/multerUpload"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.get("/signin", adminController.viewSignin);
router.post("/signin", adminController.adminLogin);
router.get("/logout", adminController.adminLogout);
router.get('/dashboard', authMiddleware_1.default.isAuthenticated, dashboardController.viewDashboard);
/*
Route-project
*/
router.get("/project", authMiddleware_1.default.isAuthenticated, projectController.viewProject);
router.put("/project", (0, multerUpload_1.default)("images").single("img"), authMiddleware_1.default.isAuthenticated, projectController.updateProject);
router.delete("/project/:id", projectController.deleteProject);
router.post("/project", (0, multerUpload_1.default)("images").single("img"), authMiddleware_1.default.isAuthenticated, projectController.createProject);
/*
Route-blog
*/
router.get("/blog", authMiddleware_1.default.isAuthenticated, blogController.viewBlog);
router.post("/blog", (0, multerUpload_1.default)("images").single("img"), authMiddleware_1.default.isAuthenticated, blogController.createBlog);
router.put("/updateStatus/:id", authMiddleware_1.default.isAuthenticated, blogController.updateStatus);
exports.default = router;
