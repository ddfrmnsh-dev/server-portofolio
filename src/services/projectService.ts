import {PrismaClient} from "@prisma/client";
import bycrypt from "bcrypt";

const prisma = new PrismaClient(); 

const createProject = async(...params: any) => {
    try {
        console.log("params",params.name)
        // const project = await prisma.project.create({
        //     data: {
        //         name : params.name,
        //         slug: params.slug,
        //         description: params.description,
        //         path_img: params.image,
        //         link: params.link,
        //     }
        // })

        // return project
    } catch (error) {
        console.log("Error", error) 
        return error
    }
}

export {
    createProject
}