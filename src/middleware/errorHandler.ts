import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../utils/responseApi';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    const response = apiResponse(err.message, 500, 'error', null);
    res.status(500).json(response);
}
