import { Request, Response, NextFunction } from "express";
import * as userService from "../../services/userService";
import { apiResponse } from "../../utils/responseApi";
import { decryptData } from "../../utils/cryptoUtils";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const order = req.query.order || "asc";
    const offset = (page - 1) * limit;

    let user = await userService.getAllUser(limit, offset, order);

    const totalUsers: any = await userService.countUser();

    const activeUsers: any = await userService.countUserActive()
    let data = {
      user: user,
      page: page,
      userActive: activeUsers,
      total: totalUsers  // Pastikan mengirimkan totalUsers bukan totalPages
    };

    return res.json(apiResponse("get all user", 200, "success", data));

    // const page = parseInt(req.query.page as string) || 1;
    // const limit = parseInt(req.query.limit as string) || 5;
    // const order = req.query.order || "asc";
    // const offset = (page - 1) * limit;

    // let user = await userService.getAllUser(limit, offset, order);

    // console.log(user);
    // const totalUsers: any = await userService.countUser();

    // const totalPages = Math.ceil(totalUsers / limit);

    // let data = {
    //   user: user,
    //   page: page,
    //   total: totalPages
    // }
    // return res.json(apiResponse("get all user", 200, "success", data));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {

    const { name, email, password } = req.body

    // let decryptedPassword = decryptData(password)

    // console.log(decryptedPassword)
    const user = await userService.createUser(name, email, password)
    // const user = await userService.createUser(name, email, decryptedPassword)
    return res.status(200).json(apiResponse("create user", 200, "success", user));
  } catch (error:any) {
    const errorMessage = error.message || 'An unexpected error occurred';

    if (errorMessage.includes('already exists')) {
      res.status(409).json({ status: false, error: errorMessage  });
    } else if (errorMessage.includes('required') || errorMessage.includes('must be')) {
      res.status(400).json({ status: false, error: errorMessage });
    } else {
      res.status(500).json({ status: false, error: 'Internal server error'});
    }
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const ids = parseInt(id);
    const user = await userService.deleteUser(ids);
    return res.status(200).json(apiResponse("delete user", 200, "success", user));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
}

export { getAllUser, createUser, deleteUser };
