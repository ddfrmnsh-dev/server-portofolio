import { Request, Response } from "express";
import * as userService from "../services/userService";
import * as projectService from "../services/projectService";
import bcrypt from "bcrypt";
import jwt, {Secret} from 'jsonwebtoken';
import slug from "slug";
import { User } from "@prisma/client";
import moment from "moment";

let secret = process.env.TOKEN_SECRET

const viewSignin = (req: Request, res: Response) => {
    try {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        if(req.session.user == null || req.session.user == undefined ){
            res.render('index', {layout:'index',title: 'Login', alert});
        }else {
            res.redirect('/admin/dashboard');
        }
        // res.render('index', {layout:'index',title: 'Login'});
    } catch (error) {
        res.redirect('/admin/signin');
    }

   
}
const adminLogin = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    console.log(email, password);
    try {
        if(email == undefined || password == undefined){
            return res.status(401).json({message: "Email atau Password tidak boleh kosong"})
        }
        const user = await userService.getUserByEmail(email);
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                const token = jwt.sign({email}, <Secret>secret, {expiresIn: '1h'})
                return res.status(200).json({"user" :{
                    "name" : user.name,
                    "email" : user.email,
                    "createdAt" : user.createdAt,
                    "updatedAt" : user.updatedAt,
                },token})
            } else {
                return res.status(401).json({message: "Password salah"})
            }
        } else {
            res.status(401).json({message: "User tidak ditemukan"})
        }
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({error :"Error"})
    }
}
const adminLoginSession = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const user = await userService.getUserByEmail(email);
        if(!user){
            req.flash('alertMessage', 'User or Password is not correct');
            req.flash('alertStatus', 'danger');
            return res.redirect('/admin/signin');
        }
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
            req.flash('alertMessage', 'User or Password is not correct');
            req.flash('alertStatus', 'danger');
            return res.redirect('/admin/signin');
            }
            // console.log("cek user", user)
            req.flash('alertMessage', 'Successfully login');
            req.flash('alertStatus', 'success');
            
            req.session.user = {
                id: user.id,
                email: user.email,
            }
        }
        req.flash('alertMessage', 'Successfully login');
        req.flash('alertStatus', 'success');
        return res.redirect('/admin/dashboard');
    } catch (error) {
        console.log("cek error sessio", error)
        // return res.status(500).json({error :"Error"})
        return res.redirect('/admin/signin');
    }
}
const adminLogout = async (req: Request, res: Response) => {
    try {
        req.session.destroy();
        return res.redirect('/admin/signin');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
const viewDashboard = async (req: Request, res: Response) => {
    try {
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alert = { message: alertMessage, status: alertStatus };
        return res.render('pages/dashboard', {layout: 'layouts/main-layout', title:'Dashboard', alert})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const viewProject = async (req: Request, res: Response) => {
    try {
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alert = { message: alertMessage, status: alertStatus };
        return res.render('pages/project/index', {layout: 'layouts/main-layout', title:'Project', alert})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
const checkData = async (req: Request, res: Response) => {
    try {
        res.json({ message: 'Halo, ' + req.decoded.user + '! Anda memiliki role ' + req.decoded.email });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUser();
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

//create function update user get id by params
const updateUser = async (req: Request, res: Response) => {
    try {
        let userId = parseInt(req.params.id)
        const { name, email, password } = req.body;
        const user = await userService.getUser(userId);
        if (user) {
            // const hashPwd = await bcrypt.hash(password, 10);
            const updateUser = await userService.updateUser(userId, name, email, password);
            return res.status(200).json(updateUser);
        } else {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteUser = async (req:Request, res: Response) => {
    try {
        let userId = parseInt(req.params.id)
        const user = await userService.getUser(userId);
        if (user) {
            const deleteUser = await userService.deleteUser(userId);
            return res.status(200).json({ message: "User berhasil dihapus", deleteUser });
        }
    } catch (error) {
        console.log("Error :", error)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

const createProject = async (req: Request, res: Response) => {
    try {
        const { name, description, link } = req.body;

        if(!req.file){
            throw new Error("File tidak ditemukan")
        }
        
        let newImg = req.file.destination + "/" + req.file.filename;
        let slugs = slug(name)
        let params = {
            name,
            description,
            image: newImg,
            link,
            slugs
        }
        const project = await projectService.createProject(params);

        return res.status(200).json(project);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export {
    adminLogin,
    viewDashboard,
    checkData,
    getAllUser,
    updateUser,
    deleteUser,
    viewSignin,
    adminLoginSession,
    adminLogout,
    viewProject,
    createProject
}