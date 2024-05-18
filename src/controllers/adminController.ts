import { Request, Response } from "express";
import * as userService from "../services/userService";
import * as projectService from "../services/projectService";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
let secret = process.env.TOKEN_SECRET;

const viewSignin = (req: Request, res: Response) => {
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    const token = req.cookies.token;
    if (!token) {
      res.render("index", { layout: "index", title: "Login", alert });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};
const adminLogin = async (req: Request, res: Response) => {
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
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ email }, <Secret>secret, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000, secure: process.env.NODE_ENV === "production" });
      } else {
        req.flash("alertMessage", "User or Password is not correct");
        req.flash("alertStatus", "danger");
        return res.redirect("/admin/signin");
      }
    } else {
      req.flash("alertMessage", "User or Password is not correct");
      req.flash("alertStatus", "danger");
      return res.redirect("/admin/signin");
    }
    req.flash("alertMessage", "Successfully login");
    req.flash("alertTitle", "Success");
    req.flash("alertStatus", "green");
    return res.redirect("/admin/dashboard");
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};


const adminLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      maxAge: 3600000,
      secure: process.env.NODE_ENV === "production"
    });
    return res.redirect("/admin/signin");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const checkData = async (req: Request, res: Response) => {
  try {
    res.json({
      message:
        "Halo, " +
        req.decoded.user +
        "! Anda memiliki role " +
        req.decoded.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUser();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    let userId = parseInt(req.params.id);
    const { name, email, password } = req.body;
    const user = await userService.getUser(userId);
    if (user) {
      // const hashPwd = await bcrypt.hash(password, 10);
      const updateUser = await userService.updateUser(
        userId,
        name,
        email,
        password
      );
      return res.status(200).json(updateUser);
    } else {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    let userId = parseInt(req.params.id);
    const user = await userService.getUser(userId);
    if (user) {
      const deleteUser = await userService.deleteUser(userId);
      return res
        .status(200)
        .json({ message: "User berhasil dihapus", deleteUser });
    }
  } catch (error) {
    console.log("Error :", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  adminLogin,
  checkData,
  getAllUser,
  updateUser,
  deleteUser,
  viewSignin,
  adminLogout,
};
