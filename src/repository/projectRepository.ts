import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const findAllProject = async (limit: number, offset: number, order: any) => {
  try {
    const projects = await prisma.project.findMany({
      take: limit,
      skip: offset,
      include: {
        client: true,
        image: true,
      },
      orderBy: {
        createdAt: order,
      },
    });
    return projects;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const saveProject = async (params: any) => {
    try {
        const files = params.files;
        const project = await prisma.$transaction(async (prisma) => {
          const newProject = await prisma.project.create({
            data: {
              name: params.name,
              description: params.description,
              linkWebsite: params.link,
              clientId: params.clientId,
              userId: params.userId,
              slug: params.slug,
            },
          });

          await prisma.image.create({
            data: {
                name: files.filename,
                projectId: newProject.id,
                pathImg: `images/${files.filename}`,
            },
          });
        });

        return project;
    } catch (error) {
        console.log("Error", error);
        return error;
      }
}

const findProjectById = async (id: number) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        client: true,
        image: true,
      }
    });
    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const updateProject = async (params: any, ids: number) => {
  try {
      const files = params.files;
        const project = await prisma.$transaction(async (prisma) => {
          await prisma.project.update({
            where: {
              id: ids,
            },
            data: {
              name: params.name,
              description: params.description,
              linkWebsite: params.link,
              author: {
                connect: {
                  id: params.userId,
                },
              },
              slug: params.slug,
              client: {
                connect: {
                  id: params.clientId,
                },
              }
            }
          });

          if (files && files != undefined) {
            const images: any = await prisma.image.findMany({
              where: {
                projectId: ids,
              },
            });

            await prisma.image.update({
              where: {
                id: images[0].id,
              },
              data: {
                name: files,
                pathImg: `images/${files}`,
              },
            });
            
          }          
        });

      return project;
  } catch (error) {
      console.log("Error", error);
      throw error;
  }
};

const deleteProject = async (id: number) => {
  try {
    const project = await prisma.project.delete({
      where: {
        id,
      },
      include: {
        image: true,
      }
    });
    return project;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const countProject = async () => {
  try {
    const project = await prisma.project.count();

    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};


export { findAllProject, saveProject, findProjectById, deleteProject, countProject, updateProject };