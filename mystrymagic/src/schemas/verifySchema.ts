import {z} from "zod"

export const verifySchema = z.object({
    code : z.string().length(0,"Verification Code Must Be 6 digits")
})