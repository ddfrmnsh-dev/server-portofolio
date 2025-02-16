import { PrismaClient } from "@prisma/client";
import { countAllClient, deleteClient, findAllClient, findClientById, saveClient, updateClient } from "../repository/clientRepository";
import fs from "fs-extra";
import path from "path";

const prisma = new PrismaClient();

const createClients = async (params: any) => {
  try {
    const client = await saveClient(params);

    return client;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const getAllClients = async (take: number, skip: number, order: any) => {
  try {
    const data = await findAllClient(take, skip, order);

    return data;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const getClientById = async (id: number) => {
  try {
    const data = await findClientById(id);

    if (!data) {
      throw new Error("Client not found");
    }

    return data;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};


const updateClients = async (params: any) => {
  try {
    if (!params.id) {
      throw new Error("Missing required fields");
    }

    const checkClient: any = await findClientById(params.id);
    if (!checkClient) {
      throw new Error("Client not found");
    }

    // Jika ada file baru, hapus gambar lama
    if (params.files !== undefined && checkClient.pathLogo) {
      const splitPath = checkClient.pathLogo.split("/");
      const lastIndex = splitPath[splitPath.length - 1];

      if (lastIndex !== "undefined") {
        const deleteImgPath = path.join("public", checkClient.pathLogo);
        try {
          await fs.unlink(deleteImgPath);
          console.log(`Deleted old image: ${deleteImgPath}`);
        } catch (err) {
          console.error(`Failed to delete old image: ${deleteImgPath}`, err);
        }
      }
    }

    // Pastikan jika params.files tidak diberikan, tetap gunakan pathLogo lama
    const updatedParams = {
      ...params,
      files: params.files ? params.files : checkClient.pathLogo.split("/").pop()
    };

    const data = await updateClient(updatedParams);
    return data;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const deleteClients = async (id: number) => {
  try {
    if (!id) {
      throw new Error("Missing required fields");
    }

    const checkClient:any = await findClientById(id);
    if (!checkClient) {
      throw new Error("Client not found");
    }

    if(checkClient) {
      const deleteImgPath = `public/${checkClient.pathLogo}`;
      try {
        await fs.unlink(path.join(deleteImgPath));
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    const data = await deleteClient(id);

    return data;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const countClient = async () => {
  try {
    const data = await countAllClient();
    return data;
  }catch (error) {
    console.log("Error", error);
    return error;
  }
}
export {
  createClients,
  getAllClients,
  getClientById,
  updateClients,
  deleteClients,
  countClient
};
