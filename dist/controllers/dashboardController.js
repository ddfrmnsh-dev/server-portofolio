"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewDashboard = void 0;
const viewDashboard = async (req, res) => {
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
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.viewDashboard = viewDashboard;
