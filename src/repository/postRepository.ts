import { PrismaClient } from "@prisma/client";
import { error } from "console";

const prisma = new PrismaClient();

const savePost = async (params: any) => {
  try {
    const post = await prisma.$transaction(async ()=> {
        const categories = Array.isArray(params.category)
        ? params.category : [params.category]
        const files = params.image
        const post = await prisma.post.create({
          data: {
            title: params.title,
            slug: params.slug,
            content: params.content,
            published: params?.status,
            authorId: params.authorId,
            description: params.description,
            categories: {
              create: categories.map((categoryId: any) => ({
                category: {
                  connect: {
                    id: categoryId,
                  },
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
    })
    return post;
  } catch (error) {
    console.log("Error", error);
    throw error;
   }
}

const updatePostById = async (params: any) => {
  try {
    const updatedPost = await prisma.$transaction(async ()=> {
      const categoriesAdd = Array.isArray(params.addCategory)
      ? params.addCategory : [params.addCategory]
      const files = params.addImage
      const filesArray = files ?? [];
      const post = await prisma.post.update({
        where: {
          id: params.idPost
        },
        data: {
          title: params.title,
          slug: params.slug,
          content: params.content,
          published: params?.status,
          authorId: params.authorId,
          description: params.description,
          categories: categoriesAdd.length > 0 ? {
            create: categoriesAdd.map((categoryId: any) => ({
              category: {
                connect: {
                  id: categoryId,
                },
              },
            })),
            // connectOrCreate: categoriesAdd.map((categoryId: any) => ({
            //   where: { categoryId  }, // Sesuai constraint unik
            //   create: { postId: idPosts,categoryId },
            // })),
          } : undefined,
        },
      });

      if(filesArray.length > 0) {
        const imagePromises = files.map((file: any) =>
          prisma.image.update({
              where: {
                id: file.id,
              },
              data: {
                name: file.filename,
                postId: post.id,
                pathImg: `images/${file.filename}`,
              },
            })
          );
        await Promise.all(imagePromises);
        return post;
      }
    })
    
    return updatedPost;
} catch (error) {
  console.log("Error", error);
  throw error;
}
}

const findAllPost = async (limit: number, offset: number, order: any) => {
  try {
    const posts = await prisma.post.findMany({
      take: limit,
      skip: offset,
      include: {
        author: true,
        categories: {
          select:{
            category: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        image: true,
      },
      orderBy: {
        createdAt: order,
      },
    });

    return posts;
  } catch (error) {
    console.log("Error", error);
    return error;
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

const findPostById = async (id: number) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
      },
    });
    return post;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const findPostBySlug = async (slug: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        categories: true,
      },
    });
    return post;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const findOrCreateCategories =  async (categories: any[]) => {
    try {
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
    } catch (error :any) {
        console.log("Error", error);
        throw error
    }
}
      
const findAllCatgeories = async () => {
    try {
        const categories = await prisma.category.findMany({
            select: {
              id: true,
              name: true,
              slug: true,
            },
          });
        return categories;
    } catch (error :any) {
        console.log("Error", error);
        throw error
    }
}
export { findAllPost, countPost, findPostById, findPostBySlug, findOrCreateCategories, savePost, updatePostById, findAllCatgeories };