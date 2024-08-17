import { z } from "zod"

export const MessagesSchema = z.object({
    content : z.string().min(10 , {message : "Content Must be at Least 10 Charcters"}).max(300 , {message : "Content Must be no longer then 300 Charcters"})
});

