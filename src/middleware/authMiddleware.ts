import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    req.flash("alertMessage", "Token tidak tersedia, akses ditolak");
    req.flash("alertStatus", "danger");
    return res.redirect("/admin/signin");
  }

  try {
    const secret: Secret = process.env.TOKEN_SECRET || "defaultSecret";
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        req.flash("alertMessage", "Token tidak valid");
        req.flash("alertStatus", "danger");
        return res.redirect("/admin/signin");
      }
      req.decoded = decoded;
      next();
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      req.flash("alertMessage", "Your session expired, please login again !");
      req.flash("alertStatus", "danger");
      return res.redirect("/admin/signin");
    }
    req.flash("alertMessage", "Token tidak valid, akses ditolak");
    req.flash("alertStatus", "danger");
    return res.redirect("/admin/signin");
  }
};


export default {
  isAuthenticated,
};
