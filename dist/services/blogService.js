"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.findOrCreateCategories = exports.getAllPost = exports.checkSlug = exports.createPost = exports.findById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPost = async (params) => {
    try {
        //create category in post
        // const categories = params.categories.map((category: any) => category.name);
        // console.log(categories); // Output: ['category1', 'category2', 'category3']
        const categories = Array.isArray(params.categories) ? params.categories : [params.categories];
        // console.log("params", params.categories.name)
        const post = await prisma.post.create({
            data: {
                authorId: params.authorId,
                title: params.title,
                slug: params.slug,
                content: params.content,
                published: params.published,
                categories: {
                    // create: categories.map((category: any) => ({
                    //   name: category.name,
                    //   slug: category.slug,
                    // })),
                    // create: [
                    //   {
                    //     category: {
                    //       connect: {
                    //         id: categories.map((id: number) => ({ id })),
                    //       }
                    //     }
                    //   }
                    // ]
                    create: categories.map((categoryId) => ({
                        category: {
                            connect: { id: categoryId }
                        }
                    }))
                },
            },
        });
        return post;
    }
    catch (error) {
        console.log("Error", error);
        return error;
    }
};
exports.createPost = createPost;
const checkSlug = async (slug, id) => {
    try {
        // const post = await prisma.post.findUnique({
        //   where: {
        //     id,
        //     slug,
        //   },
        // });
        // return post;
    }
    catch (error) {
        console.log("Error", error);
        return error;
    }
};
exports.checkSlug = checkSlug;
const getAllPost = async () => {
    try {
        const post = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                published: true,
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        }
                    },
                },
            },
        });
        return post;
    }
    catch (error) {
        console.log("Error", error);
    }
};
exports.getAllPost = getAllPost;
const findOrCreateCategories = async (categories) => {
    const categoryIds = await Promise.all(categories.map(async (category) => {
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: category.name,
                slug: category.slug,
            },
            select: {
                id: true,
            },
        });
        if (existingCategory) {
            return existingCategory.id;
        }
        else {
            const newCategory = await prisma.category.create({
                data: {
                    name: category.name,
                    slug: category.slug,
                },
            });
            return newCategory.id;
        }
    }));
    return categoryIds;
};
exports.findOrCreateCategories = findOrCreateCategories;
const updateStatus = async (id, status) => {
    try {
        const post = await prisma.post.update({
            where: {
                id,
            },
            data: {
                published: status,
            },
        });
        return post;
    }
    catch (error) {
        console.log("Error", error);
        return error;
    }
};
exports.updateStatus = updateStatus;
const findById = async (id) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id,
            },
            select: {
                published: true,
            }
        });
        return post;
    }
    catch (error) {
        console.log("Error", error);
        return error;
    }
};
exports.findById = findById;
