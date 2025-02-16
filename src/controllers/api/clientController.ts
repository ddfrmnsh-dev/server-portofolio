import { Request, Response, NextFunction } from "express";
import { countClient, createClients, deleteClients, getAllClients, updateClients } from "../../services/clientService";
import * as clientService from "../../services/clientService";

const getAllClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const order = (req.query.order as string) || "asc";
        const offset = (page - 1) * limit;

        const clients = await clientService.getAllClients(limit, offset, order);
        const totalClients: any = await clientService.countClient();
        if (totalClients === 0) {
            return res.status(404).json({status: false, message: "Client not found" });
        }

        const data: any = {
            clients,
            total: totalClients,
            page: page,
            limit: limit,
        };

        return res.json({status: true, message: "Successfully get all client", data: data});
    } catch (error: any) {
        const errorMessage = error.message || 'An unexpected error occurred';

        if(errorMessage) {
            res.status(400).json({ status: false, error: errorMessage });
        } else {
            res.status(500).json({ status: false, error: 'Internal server error'});
        }
    }
}

const getClientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clientId = parseInt(req.params.id);
        const client = await clientService.getClientById(clientId);
        if (!client) {
            return res.status(404).json({ status: false, message: "Client not found" });
        }
        
        return res.json({status: true, message: "Successfully get client by id", data: client});
    } catch (error: any) {
        const errorMessage = error.message || 'An unexpected error occurred';
        
        if(errorMessage) {
            res.status(400).json({ status: false, error: errorMessage });
        } else {
            res.status(500).json({ status: false, error: 'Internal server error'});
        }
    }
}
        

const createClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name} = req.body;
        const image = req.file;

        let params :any = {
            name,
            files: image?.filename
        }

        const client = await createClients(params);

        return res.json({status: true, message: "Successfully add new client", data: client});
    } catch (error: any) {
        const errorMessage = error.message || 'An unexpected error occurred';

        if(errorMessage) {
        res.status(400).json({ status: false, error: errorMessage });
        } else {
        res.status(500).json({ status: false, error: 'Internal server error'});
        }
    }
}

const updateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const images = req.file;

        console.log("images controller",images);

        let params: any = {
            id: parseInt(id),
            name,
        }

        if(images != undefined && images != null) {
            params.files = images?.filename;
        }

        const client = await updateClients(params);
        return res.json({status: true, message: "Successfully updated client", data: client});
    } catch (error: any) {
        console.error(error);

        const errorMessage = error.message || "An unexpected error occurred";
        const statusCode = errorMessage.includes("not found") ? 404 : 400;
        return res.status(statusCode).json({
            status: false,
            error: errorMessage,
        });
    }
}

const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const client = await deleteClients(parseInt(id));

        return res.json({status: true, message: "Successfully deleted client", data: client});
    } catch (error: any) {

        console.error(error);
        const errorMessage = error.message || "An unexpected error occurred";
        const statusCode = errorMessage.includes("not found") ? 404 : 400;
        return res.status(statusCode).json({
            status: false,
            error: errorMessage,
        });
    }
}

export {getAllClient, createClient, updateClient, deleteClient, getClientById}