import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, "The name is required, minimum 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Minimum 8 characters")
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password must not be empty")
});

export const updateProfileSchema = z.object({
    name: z.string().min(2, "The name is required, minimum 2 characters").optional(),
    email: z.string().email("Invalid email format").optional()
}).refine((data) => data.name !== undefined || data.email !== undefined, {
    message: 'Provide at least a name or an email',
});
