import { PrismaClient } from "@prisma/client";
import bycrypt from "bcrypt";
import { findAllPost, findPostBySlug, savePost, updatePostById } from "../repository/postRepository";
import slug from "slug";
import { findImagePostById } from "../repository/imageRepository";
import fs from "fs-extra";
import path from "path";

const prisma = new PrismaClient();

const createPosts = async (params: any) => {
  try {
    let categories = params.category
    if (!Array.isArray(categories)) {
      throw new Error("Categories must be an array");
    }

    let category = []
    if(categories) {
      for (let i = 0; i < categories.length; i++) {
        let slugCategory = slug(categories[i])
        let nameCategory = categories[i]
        console.log("check name category",nameCategory)
        let categoryObj = {
          name: nameCategory,
          slug: slugCategory
        }
        category.push(categoryObj)
      }
    }

    let checkCategoryPost = await findOrCreateCategories(category)
    params.category = checkCategoryPost

    const checkSlugPost = await findPostBySlug(params.slug)
    if (checkSlugPost) {
      throw new Error("Slug already exists");
    }

    if (!params.image || params.image.length === 0) {
      throw new Error("No files uploaded");
    }

    const post = await savePost(params);

    return post;
  } catch (error: any) {
    console.log("Error", error);
    throw error
  }
}

const updatePosts = async (params: any) => {
  try {
    let addCategory = params.addCategory
    let removeCategory = params.removeCategory

    console.log("img", params.addImage)
    // if(!Array.isArray(addCategory) || !Array.isArray(removeCategory)) {
    //   throw new Error("Categories must be an array");
    // }

    let categoryAdd = []
    if(addCategory?.length > 0) {
      for (let i = 0; i < addCategory.length; i++) {
        let slugCategory = slug(addCategory[i])
        let nameCategory = addCategory[i]
        let categoryObj = {
          name: nameCategory,
          slug: slugCategory
        }
        categoryAdd.push(categoryObj)
      }
    }

    let checkCategoryPost = await findOrCreateCategories(categoryAdd)
    params.addCategory = checkCategoryPost

    if(removeCategory?.length > 0) {
      await unlinkCategories(params.idPost, removeCategory)
    }

    if(params?.removeImage) {
      const checkImage: any = await findImagePostById(params?.removeImage)
      if (checkImage && checkImage.length > 0) {
        console.log("check image",checkImage)
        for (const image of checkImage) {
          const oldImagePath = `public/${image.pathImg}`;
          try {
              await fs.unlink(path.join(oldImagePath));
            console.log(`Deleted image: ${image.pathImg}`);
          } catch (err) {
            console.error(`Failed to delete image: ${image.pathImg}`, err);
          }
        }
      }
    }

    const updatedPost = await updatePostById(params);
    return updatedPost;
  } catch (error: any) {
    console.log("Error", error);
    throw error
  }
}

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
            pathImg: `images/${file.filename}`,
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

const getAllPosts = async (take: number, skip: number, order: any) => {
  try {
    // const data = await prisma.post.findMany({
    //   skip: skip,
    //   take: take,
    //   where: {
    //     published: true,
    //   },
    //   select: {
    //     id: true,
    //     title: true,
    //     slug: true,
    //     content: true,
    //     published: true,
    //     categories: {
    //       select: {
    //         category: {
    //           select: {
    //             id: true,
    //             name: true,
    //             slug: true,
    //           },
    //         },
    //       },
    //     },
    //     author: {
    //       select: {
    //         name: true,
    //       },
    //     },
    //     image: {
    //       select: {
    //         id: true,
    //         pathImg: true,
    //       },
    //     },
    //   },
    //   orderBy: {
    //     createdAt: "desc",
    //   },
    // });

    const post = findAllPost(take, skip, order);

    if (!post) {
      throw new Error("No post found");
    }

    return post;
  } catch (error) {
    console.log("Error", error);
    throw error
  }
};

const countPost = async () => {
  try {
    const count = await prisma.post.count();
    return count;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};
const getAllPost = async (take: number, skip: number, order: any) => {
  try {
    const data = await prisma.post.findMany({
      take: take,
      skip: skip,
      orderBy: {
        createdAt: order,
      },
    });

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

const unlinkCategories = async (postId: number, categoryIds: number[]) => {
  console.log("postIds", postId);
  console.log("categoryIds", categoryIds);
  // await prisma.post.update({
  //   where: {
  //     id: postId 
  //   },
  //   data: {
  //     categories: {
  //       disconnect: categoryIds.map((categoryId) => ({ id: categoryId })),
  //     },
  //   }
  // });

  await prisma.categoryOnPost.deleteMany({
    where: {
      postId: postId,
      categoryId: {
        in: categoryIds,
      },
    },
  });

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
            pathImg: true,
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
    const post = await findPostBySlug(slug);

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
  getAllPosts,
  countPost,
  createPosts,
  updatePosts,
  unlinkCategories
};
