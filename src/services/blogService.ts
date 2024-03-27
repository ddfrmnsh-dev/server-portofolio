import { PrismaClient } from "@prisma/client";
import bycrypt from "bcrypt";

const prisma = new PrismaClient();

const createPost = async (params: any) => {
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
        path_img: params.path_img,
        published: params.published,
        categories: {
          // create: categories.map((category: any) => ({
          //   name: category.name,
          //   slug: category.slug,
          // })),
          connect: categories.map((id: number) => ({ id })),
        },
      },
    });
    return post;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const checkSlug = async (slug: string, id?: number) => {
  try {
    // const post = await prisma.post.findUnique({
    //   where: {
    //     id,
    //     slug,
    //   },
    // });
    // return post;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const getAllPost = async () => {
  try {
    const post = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        path_img: true,
        published: true,
        categories: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    console.log("Error", error);
  }
}

const findOrCreateCategories = async (categories: any[]) => {
  const categoryIds = await Promise.all(categories.map(async (category: any) => {
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
    } else {
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

export { createPost, checkSlug, getAllPost, findOrCreateCategories };
