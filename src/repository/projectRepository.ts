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
        console.log("id params", params.userId);
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
          

          console.log("Creating image with data:", {
            name: files.filename,
            pathImg: `images/${files.filename}`,
            projectId: newProject.id,
          });

          await prisma.image.create({
            data: {
                name: files.filename,
                projectId: newProject.id,
                pathImg: `images/${files.filename}`,
            },
          });
          // const imagePromises = Object.values(files as { filename: string }[]).map(file =>
          //   prisma.image.create({
          //     data: {
          //       name: file.filename,
          //       projectId: newProject.id,
          //       pathImg: `images/${file.filename}`
          //     },
          //   })
          // );
    
          // await Promise.all(imagePromises);
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
      const files = params.files;
        const project = await prisma.$transaction(async (prisma) => {
          await prisma.project.update({
            where: {
              id: params.id,
            },
            data: {
              name: params.name,
              slug: params.slug,
              description: params.description,
              linkWebsite: params.link,
              clientId: params?.clientId,
              userId: params?.userId,
            },
          });
    
          // if (files && files.length > 0) {
          //   const updateImagePromises = files.map((file: any) =>
          //     prisma.image.updateMany({
          //       where: {
          //         projectId: params.id,
          //       },  
          //       data: {
          //         name: file.filename,
          //         pathImg: `images/${file.filename}`,
          //       },
          //     })
          //   );

          //   await Promise.all(updateImagePromises);
          // }

          if (files && files != undefined) {
            const images: any = await prisma.image.findMany({
              where: {
                projectId: params.id,
              },
            });

            await prisma.image.update({
              where: {
                id: images[0].id,
              },
              data: {
                name: files.filename,
                pathImg: `images/${files.filename}`,
              },
            });
          
            // const updateImagePromises = images.map((image, index) => {
            //   const file = files[index];
            //   return prisma.image.update({
            //     where: {
            //       id: image.id,
            //     },
            //     data: {
            //       name: file.filename,
            //       pathImg: `images/${file.filename}`,
            //     },
            //   });
            // });
          
            // await Promise.all(updateImagePromises);
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


export { getAllProject, saveProject, findProjectById, deleteProject, countProject, updateProject };