import { Request, Response } from "express";

const viewDashboard = async (req: Request, res: Response) => {
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alertTitle = req.flash("alertTitle");
    const alert = {
      message: alertMessage,
      status: alertStatus,
      title: alertTitle,
    };
    return res.render("pages/dashboard", {
      layout: "layouts/main-layout",
      title: "Dashboard",
      alert,
      user: req.decoded,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { viewDashboard };
