import { z } from 'zod';

// Username validation
export const usernameValidation = z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(20, "Username must be no more than 20 characters long")
    .regex(/^[a-zA-Z0-9._]+$/, "Username must not contain special characters");

// Sign-up schema with custom email validation
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email address"), // Custom regex for email validation
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" }) // Validate password length
});
