import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllProject = async (limit: number, offset: number, order: any) => {
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
              userId: params.userId,
              slug: params.slug,
              description: params.description,
              linkWebsite: params.link,
              clientId: params.clientId,
            },
          });
    
          const imagePromises = files.map((file: any) =>
            prisma.image.create({
              data: {
                name: file.filename,
                projectId: newProject.id,
                pathImg: `images/${file.filename}`,
              },
            })
          );
    
          await Promise.all(imagePromises);
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
    });
    return project;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const updateProject = async (params: any) => {
  try {
    const project = await prisma.project.update({
      where: {
        id: params.id,
      },
      data: {
        name: params.name,
        slug: params.slug,
        description: params.description,
        linkWebsite: params.link,
        clientId: params?.client,
      },
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

export { getAllProject, saveProject, findProjectById, deleteProject, countProject };