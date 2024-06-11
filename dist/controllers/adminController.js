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
exports.adminLogout = exports.viewSignin = exports.deleteUser = exports.updateUser = exports.getAllUser = exports.checkData = exports.adminLogin = void 0;
const userService = __importStar(require("../services/userService"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let secret = process.env.TOKEN_SECRET;
const viewSignin = (req, res) => {
    try {
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alert = { message: alertMessage, status: alertStatus };
        const token = req.cookies.token;
        if (!token) {
            res.render("index", { layout: "index", title: "Login", alert });
        }
        else {
            res.redirect("/admin/dashboard");
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Error" });
    }
};
exports.viewSignin = viewSignin;
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        if (email == undefined || password == undefined) {
            req.flash("alertMessage", "User or Password is not empty");
            req.flash("alertStatus", "danger");
            return res.redirect("/admin/signin");
        }
        const user = await userService.getUserByEmail(email);
        if (user) {
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (isMatch) {
                const token = jsonwebtoken_1.default.sign({ email, user: user.name }, secret, { expiresIn: "1h" });
                res.cookie("token", token, { httpOnly: true, maxAge: 3600000, secure: process.env.NODE_ENV === "production" });
            }
            else {
                req.flash("alertMessage", "User or Password is not correct");
                req.flash("alertStatus", "danger");
                return res.redirect("/admin/signin");
            }
        }
        else {
            req.flash("alertMessage", "User or Password is not correct");
            req.flash("alertStatus", "danger");
            return res.redirect("/admin/signin");
        }
        req.flash("alertMessage", "Successfully login");
        req.flash("alertTitle", "Success");
        req.flash("alertStatus", "green");
        return res.redirect("/admin/dashboard");
    }
    catch (error) {
        return res.status(500).json({ error: "Error" });
    }
};
exports.adminLogin = adminLogin;
const adminLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            maxAge: 3600000,
            secure: process.env.NODE_ENV === "production"
        });
        return res.redirect("/admin/signin");
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.adminLogout = adminLogout;
const checkData = async (req, res) => {
    try {
        res.json({
            message: "Halo, " +
                req.decoded.user +
                "! Anda memiliki role " +
                req.decoded.email,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.checkData = checkData;
const getAllUser = async (req, res) => {
    try {
        const users = await userService.getAllUser();
        return res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getAllUser = getAllUser;
const updateUser = async (req, res) => {
    try {
        let userId = parseInt(req.params.id);
        const { name, email, password } = req.body;
        const user = await userService.getUser(userId);
        if (user) {
            // const hashPwd = await bcrypt.hash(password, 10);
            const updateUser = await userService.updateUser(userId, name, email, password);
            return res.status(200).json(updateUser);
        }
        else {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        let userId = parseInt(req.params.id);
        const user = await userService.getUser(userId);
        if (user) {
            const deleteUser = await userService.deleteUser(userId);
            return res
                .status(200)
                .json({ message: "User berhasil dihapus", deleteUser });
        }
    }
    catch (error) {
        console.log("Error :", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.deleteUser = deleteUser;
