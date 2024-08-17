import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2,"Username must Be Atleast 2 Char")
    .max(20,"Username must Be On More Then 20")
    .regex(/^[a-zA-Z0-9._]+$/,"Username Must Not Contain Spacial Character");

export const signUpSchema = z.object({
    username : usernameValidation,
    email: z.string().email({message: "Invaild Email Addreas"}),
    password: z.string().min(6,{message : "Password Must be At least 6 Charecters"})
})