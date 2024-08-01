import { Request, Response, NextFunction } from "express";
import * as clientService from "../services/clientService";
import fs from "fs-extra";
import path from "path";
const postClient = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    let pathLogo = `images/${req.file?.filename}`;

    let params = {
      name: name,
      path_logo: pathLogo,
    };

    const data = await clientService.createClient(params);
    console.log("success", data);

    return res.redirect("/admin/client");
  } catch (error) {
    console.log("Err", error);
    return res.redirect("/admin/client");
  }
};

const viewClient = async (req: Request, res: Response) => {
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alertTitle = req.flash("alertTitle");
    const alert = {
      message: alertMessage,
      status: alertStatus,
      title: alertTitle,
    };
    const data = await clientService.getAllClient();
    if (!data) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.render("pages/client/index", {
      layout: "layouts/main-layout",
      title: "Client",
      alert,
      data: data,
      user: req.decoded,
    });
  } catch (error) {
    console.log("Err", error);
    return res.redirect("/admin/dashboard");
  }
};

const updateClient = async (req: Request, res: Response) => {
  const { id, name } = req.body;
  let ids = parseInt(id);
  try {
    const client: any = await clientService.getClientById(ids);
    if (req.file == undefined) {
      let params: any = {
        id: ids,
        name: name,
      };
      await clientService.updateClient(params);
      req.flash("alertMessage", "Successfully update client without image");
      req.flash("alertTitle", "Success");
      req.flash("alertStatus", "green");
    } else {
      await fs.unlink(path.join(`public/${client.path_logo}`));
      let pathLogo = `images/${req.file.filename}`;
      let params: any = {
        id: ids,
        name: name,
        path_logo: pathLogo,
      };
      await clientService.updateClient(params);
      req.flash("alertMessage", "Successfully update client");
      req.flash("alertTitle", "Success");
      req.flash("alertStatus", "green");
    }
    return res.redirect("/admin/client");
  } catch (error: any) {
    req.flash("alertMessage", error.message);
    req.flash("alertTitle", "Failed");
    req.flash("alertStatus", "red");
    console.error(error);
    res.redirect("/admin/client");
  }
};

const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Id tidak ditemukan");
    }
    let params = parseInt(id);
    const item: any = await clientService.getClientById(params);

    await fs.unlink(path.join(`public/${item.path_logo}`), (err) => {
      if (err) {
        throw new Error("Failed to delete image");
      }
    });

    await clientService.deleteClient(params);
    req.flash("alertMessage", "Successfully delete client");
    req.flash("alertTitle", "Delete");
    req.flash("alertStatus", "red");
    return res.redirect("/admin/client");
  } catch (error: any) {
    req.flash("alertMessage", error.message);
    req.flash("alertTitle", "Failed");
    req.flash("alertStatus", "red");
    console.error(error);
    res.redirect("/admin/client");
  }
};

export { postClient, viewClient, updateClient, deleteClient };
