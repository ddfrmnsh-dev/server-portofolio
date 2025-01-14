import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();
const healthCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
    
        // const response = await axios.get('localhost:3001/api/health');
    
        // if (response.status !== 200 || response.data.status !== 'healthy') {
        //     throw new Error('Downstream service is unhealthy');
        // }
    
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