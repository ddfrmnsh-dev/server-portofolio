import { PrismaClient } from "@prisma/client";
import bycrypt from "bcrypt";

const prisma = new PrismaClient();

const createPost = async (params: any) => {
  try {
    //create category in post
    const post = await prisma.post.create({
      data: {
        authorId: params.authorId,
        title: params.title,
        slug: params.slug,
        content: params.content,
        path_img: params.path_img,
        published: params.published,
        categories: {
          create: [
            {
              name: params.category,
              slug: params.categorySlug,
            },
          ],
        },
      },
    });
    return post;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const checkSlug = async (slug: string) => {
  try {
    // const post = await prisma.post.findUnique({
    //   where: {
    //     slug,
    //   },
    // });
    // return post;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

export { createPost, checkSlug };
