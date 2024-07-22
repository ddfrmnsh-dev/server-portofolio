import { PrismaClient } from "@prisma/client";
import bycrypt from "bcrypt";

const prisma = new PrismaClient();

const createPost = async (params: any) => {
  try {
    const posts = await prisma.$transaction(async () => {
      const categories = Array.isArray(params.categories)
        ? params.categories
        : [params.categories];
      // console.log("params", params.categories.name)
      const files = params.files;
      const post = await prisma.post.create({
        data: {
          authorId: params.authorId,
          title: params.title,
          slug: params.slug,
          content: params.content,
          published: params.published,
          description: params.description,
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
                connect: { id: categoryId },
              },
            })),
          },
        },
      });

      const imagePromises = files.map((file: any) =>
        prisma.image.create({
          data: {
            name: file.filename,
            postId: post.id,
            path_img: `images/${file.filename}`,
          },
        })
      );
      await Promise.all(imagePromises);
    });
    return posts;
  } catch (error) {
    console.log("Error", error);
    throw error;
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

const getAllPostAPI = async (take: number, skip: number) => {
  // const getAllPostAPI = async () => {
  try {
    console.log("cek data", take, skip);
    const data = await prisma.post.findMany({
      skip: skip,
      take: take,
      where: {
        published: true,
      },
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
            },
          },
        },
        author: {
          select: {
            name: true,
          },
        },
        image: {
          select: {
            id: true,
            path_img: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  } catch (error) {
    console.log("Error", error);
  }
};

const countPost = async () => {
  try {
    const count = await prisma.post.count({
      where: {
        published: true,
      },
    });
    console.log("cek count", count);
    return count;
  } catch (error) {
    console.log("Error", error);
  }
};
const getAllPost = async () => {
  try {
    const data = await prisma.post.findMany();

    return data;
  } catch (error) {
    console.log("Error", error);
  }
};

const findOrCreateCategories = async (categories: any[]) => {
  const categoryIds = await Promise.all(
    categories.map(async (category: any) => {
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
    })
  );

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
};

const findById = async (id: number) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      // select: {
      //   published: true,
      // },
      include: {
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        author: {
          select: {
            name: true,
          },
        },
        image: {
          select: {
            id: true,
            path_img: true,
          },
        },
      },
    });
    return post;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const findBySlug = async (slug: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        author: {
          select: {
            name: true,
            profession: true,
            image: {
              select: {
                id: true,
                path_img: true,
              },
            },
          },
        },
        image: {
          select: {
            id: true,
            path_img: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const deleteBlog = async (id: number) => {
  try {
    const project = await prisma.post.delete({
      where: {
        id,
      },
    });
    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};
export {
  findById,
  createPost,
  checkSlug,
  getAllPost,
  findOrCreateCategories,
  updateStatus,
  deleteBlog,
  findBySlug,
  getAllPostAPI,
  countPost,
};
