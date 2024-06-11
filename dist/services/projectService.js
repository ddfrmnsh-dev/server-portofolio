"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getAllProject = exports.createProject = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProject = async (params) => {
    try {
        console.log("params", params.name);
        // const project = await prisma.project.create({
        //     data: {
        //         name: params.name,
        //         slug: params.slug,
        //         description: params.description
        //     }
        // })
        // return project
    }
    catch (error) {
        console.log("Error", error);
        return error;
    }
};
exports.createProject = createProject;
const getAllProject = async () => {
    try {
        const project = await prisma.project.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
            }
        });
        return project;
    }
    catch (error) {
        console.log("Error", error);
        return error;
    }
};
exports.getAllProject = getAllProject;
const getProjectById = async (id) => {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id
            }
        });
        return project;
    }
    catch (error) {
        console.log("Error", error);
        return error;
    }
};
exports.getProjectById = getProjectById;
const updateProject = async (params) => {
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
        });
        return project;
    }
    catch (error) {
        console.log("Error", error);
        return error;
    }
};
exports.updateProject = updateProject;
const deleteProject = async (id) => {
    try {
        const project = await prisma.project.delete({
            where: {
                id
            }
        });
        return project;
    }
    catch (error) {
        console.log("Error", error);
        return error;
    }
};
exports.deleteProject = deleteProject;
