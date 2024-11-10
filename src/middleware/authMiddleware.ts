import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    req.flash("alertMessage", "Token tidak tersedia, akses ditolak");
    req.flash("alertTitle", "Failed");
    req.flash("alertStatus", "red");
    return res.redirect("/admin/signin");
  }

  try {
    const secret: Secret = process.env.TOKEN_SECRET || "defaultSecret";
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        req.flash("alertMessage", "Token tidak valid");
        req.flash("alertTitle", "Failed");
        req.flash("alertStatus", "red");
        return res.redirect("/admin/signin");
      }
      req.decoded = decoded;
      next();
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      req.flash("alertMessage", "Your session expired, please login again !");
      req.flash("alertTitle", "Failed");
      req.flash("alertStatus", "red");
      return res.redirect("/admin/signin");
    }
    req.flash("alertMessage", "Token tidak valid, akses ditolak");
    req.flash("alertTitle", "Failed");
    req.flash("alertStatus", "red");
    return res.redirect("/admin/signin");
  }
};

const authMiddlewares = (req: Request, res: Response, next: NextFunction) => {
  // const token = req.header('Authorization')
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token tidak tesedia, access denied" });
  }

  try {
    let secret = process.env.TOKEN_SECRET;
    jwt.verify(token, <Secret>secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token tidak valid" });
      }
      next();
    });
  } catch (e) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

export default {
  isAuthenticated,
  authMiddlewares
};
