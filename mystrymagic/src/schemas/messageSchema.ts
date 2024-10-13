import { z } from "zod"

export const MessagesSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    message: z.string().min(10, { message: "Content must be at least 10 characters" }).max(300, { message: "Content must be no longer than 300 characters" })
});