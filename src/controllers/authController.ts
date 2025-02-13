import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "@prisma/client";
import { decryptData, encryptData } from "../utils/cryptoUtils";
import { stat } from "fs-extra";
import { apiResponse } from "../utils/responseApi";

let secret = process.env.TOKEN_SECRET;
const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let decryptedPassword = decryptData(password);

  try {
    const user = await userService.getUserByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(decryptedPassword, user.password);
      if (isMatch) {
        const token = jwt.sign({ email, user: user.name, id: user.id }, <Secret>secret, {
          expiresIn: "1h",
        });
         
        if (user.isActive === false || user.isActive === null) {
          return res.status(401).json({ status : false, message: "User is not active" });
        }

        return res.status(200).json(apiResponse("Successfully Login", 200, "success", {
            user: {
              name: user.name,
              email: user.email,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              pathImg: user?.pathImg
            },
            token: `Bearer ${token}`,
          })
        );
      } else {
        return res.status(401).json({ message: "Invalid credentials", status: false });
      }
    } else {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};

const checkAuth = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ email }, <Secret>secret, {
          expiresIn: "60000",
        });
        return res.status(200).json({
          user: {
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          token: token,
          redirect: "/dashboard",
          Authorization: `Bearer ${token}`,
        });
      } else {
        return res.status(401).json({ message: "Password salah" });
      }
    } else {
      res.status(401).json({ message: "User tidak ditemukan" });
    }
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};

const decryptTest = async (req: Request, res: Response) => {
  const { data } = req.body;
  const encryptedData = encryptData(data);
  res.json({ encryptedData });
};
export { userLogin, checkAuth, decryptTest };
