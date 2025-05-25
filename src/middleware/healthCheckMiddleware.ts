import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();
const healthCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        next();
    } catch (error: any) {
        if (error.response) {
            console.error('Error response from Axios:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            console.error('No response received from Axios:', error.request);
        } else {
            console.error('General error:', error.message);
        }

        res.status(503).send('No healthy upstream');
    }
};

export default healthCheckMiddleware;