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
const userController = __importStar(require("../controllers/userController"));
const AuthController = __importStar(require("../controllers/authController"));
const adminContller = __importStar(require("../controllers/adminController"));
const projectController = __importStar(require("../controllers/projectController"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post('/register', userController.createNewUser);
router.post('/login', AuthController.userLogin);
router.post('/checkAuth', AuthController.checkAuth);
router.get('/checkMiddleware', authMiddleware_1.default.isAuthenticated, (req, res) => {
    const data = 'cek oke';
    return res.json({ message: data });
});
router.get('/checkAuths', authMiddleware_1.default.isAuthenticated, adminContller.checkData);
router.delete('/project/:id', authMiddleware_1.default.isAuthenticated, projectController.deleteProject);
exports.default = router;
