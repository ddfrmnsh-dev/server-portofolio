import { PrismaClient } from "@prisma/client";
import bycrypt from "bcrypt";

const prisma = new PrismaClient();

const createPost = async (params: any) => {
  try {
    const posts = await prisma.$transaction(async () => {

      const categories = Array.isArray(params.categories) ? params.categories : [params.categories];
      // console.log("params", params.categories.name)
      const files = params.files;
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
            create: categories.map((categoryId: any) => ({
              category: {
                connect: { id: categoryId }
              }
            }))
          },
        },
      });

      const imagePromises = files.map((file: any) =>
        prisma.image.create({
          data: {
            name: file.filename,
            postId: post.id,
            path_img: `images/${file.filename}`,
          }
        })
      );
      await Promise.all(imagePromises)
    })
    return posts;
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

const updateStatus = async (id: number, status: boolean) => {
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
  } catch (error) {
    console.log("Error", error);
    return error;
  }
}

const findById = async (id: number) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        published: true,
      }

    })
    return post;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
}
export { findById, createPost, checkSlug, getAllPost, findOrCreateCategories, updateStatus };
