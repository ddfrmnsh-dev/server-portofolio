import { Request, Response, NextFunction } from "express";
import * as userService from "../../services/userService";
import { apiResponse } from "../../utils/responseApi";

const getAllUser = async (req: Request, res: Response) => {
  try {
    let user = await userService.getAllUser();

    console.log(user);

    return res.json(apiResponse("get all user", 200, "success", user));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

export { getAllUser };
