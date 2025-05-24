import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    console.log(`[${req.method}] ${req.originalUrl} | Body:`, req.body);
    res.on('finish', () =>
        console.log(`Status: ${res.statusCode} | Duration: ${Date.now() - start}ms`)
    );
    next();
};
