import { PrismaClient } from "@prisma/client";
import bycrypt from "bcrypt";

const prisma = new PrismaClient();

const createProject = async (params: any) => {
    try {
        console.log("params", params.name)
        // const project = await prisma.project.create({
        //     data: {
        //         name: params.name,
        //         slug: params.slug,
        //         description: params.description
        //     }
        // })

        // return project
    } catch (error) {
        console.log("Error", error)
        return error
    }
}

const getAllProject = async () => {
    try {
        const project = await prisma.project.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
            }
        })
        return project
    } catch (error) {
        console.log("Error", error)
        return error
    }
}

const getProjectById = async (id: number) => {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id
            }
        })
        return project
    } catch (error) {
        console.log("Error", error)
        return error
    }
}

const updateProject = async (params: any) => {
    try {
        const project = await prisma.project.update({
            where: {
                id: params.id
            },
            data: {
                name: params.name,
                slug: params.slug,
                description: params.description,
            }
        })
        return project
    } catch (error) {
        console.log("Error", error)
        return error
    }
}

const deleteProject = async (id: number) => {
    try {
        const project = await prisma.project.delete({
            where: {
                id
            }
        })
        return project
    } catch (error) {
        console.log("Error", error)
        return error
    }
}
export {
    createProject,
    getAllProject,
    getProjectById,
    updateProject,
    deleteProject
}