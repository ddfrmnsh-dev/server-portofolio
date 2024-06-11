"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.flash("alertMessage", "Token tidak tersedia, akses ditolak");
        req.flash("alertStatus", "danger");
        return res.redirect("/admin/signin");
    }
    try {
        const secret = process.env.TOKEN_SECRET || "defaultSecret";
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                req.flash("alertMessage", "Token tidak valid");
                req.flash("alertStatus", "danger");
                return res.redirect("/admin/signin");
            }
            req.decoded = decoded;
            next();
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            req.flash("alertMessage", "Your session expired, please login again !");
            req.flash("alertStatus", "danger");
            return res.redirect("/admin/signin");
        }
        req.flash("alertMessage", "Token tidak valid, akses ditolak");
        req.flash("alertStatus", "danger");
        return res.redirect("/admin/signin");
    }
};
exports.default = {
    isAuthenticated,
};
