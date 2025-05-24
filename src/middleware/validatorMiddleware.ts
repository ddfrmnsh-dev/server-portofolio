import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const zodValidator = (schema: ZodSchema) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error: any) {
        res.status(400).json({ message: "Validation failed", status: false, errors: error.errors });
    }
};
