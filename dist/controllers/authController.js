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
exports.checkAuth = exports.userLogin = void 0;
const userService = __importStar(require("../services/userService"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let secret = process.env.TOKEN_SECRET;
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userService.getUserByEmail(email);
        if (user) {
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (isMatch) {
                const token = jsonwebtoken_1.default.sign({ email, user: user.name }, secret, { expiresIn: '1h' });
                return res.status(200).json({
                    "user": {
                        "name": user.name,
                        "email": user.email,
                        "createdAt": user.createdAt,
                        "updatedAt": user.updatedAt,
                    }, token: `Bearer ${token}`
                });
            }
            else {
                return res.status(401).json({ message: "Password salah" });
            }
        }
        else {
            return res.status(401).json({ message: "User tidak ditemukan" });
        }
        return res.status(201).json(user);
    }
    catch (error) {
        return res.status(500).json({ error: "Error" });
    }
};
exports.userLogin = userLogin;
const checkAuth = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userService.getUserByEmail(email);
        if (user) {
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (isMatch) {
                const token = jsonwebtoken_1.default.sign({ email }, secret, { expiresIn: '60000' });
                return res.status(200).json({
                    user: {
                        "name": user.name,
                        "email": user.email,
                        "createdAt": user.createdAt,
                        "updatedAt": user.updatedAt,
                    },
                    token: token,
                    redirect: '/dashboard',
                    Authorization: `Bearer ${token}`
                });
            }
            else {
                return res.status(401).json({ message: "Password salah" });
            }
        }
        else {
            res.status(401).json({ message: "User tidak ditemukan" });
        }
        return res.status(201).json(user);
    }
    catch (error) {
        return res.status(500).json({ error: "Error" });
    }
};
exports.checkAuth = checkAuth;
