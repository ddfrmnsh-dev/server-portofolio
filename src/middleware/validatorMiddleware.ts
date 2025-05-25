import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

type ValidationSchemas = {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
};

export const zodValidator = (schemas: ValidationSchemas) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (schemas.body) schemas.body.parse(req.body);
        if (schemas.params) schemas.params.parse(req.params);
        if (schemas.query) schemas.query.parse(req.query);
        next();
    } catch (error: any) {
        return res.status(400).json({
            message: "Validation failed",
            status: false,
            errors: error.errors,
        });
    }
};
