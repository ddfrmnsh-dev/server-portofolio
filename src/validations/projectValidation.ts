import { z } from 'zod';

export const findProjectSchema = z.object({
    id: z.string(),
});

export const createProjectSchema = z.object({
    name: z.string(),
    description: z.string(),
    link: z.string().url().nullable(),
});

export const updateProjectSchema = z.object({
    name: z.string().nullable(),
    description: z.string().nullable(),
    link: z.string().url().nullable(),
});

