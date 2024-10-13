import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signupSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
});


export async function GET(request: Request) {
    if(request.method !== "GET"){
        return Response.json({
            success : false,
            message  : "Method Not Allowed"
        },{status: 500});
    }
    await dbconnect();

    try {
    
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result); // check
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,// 17
                message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invaild Quary Parameters"
            },
                {
                    status: 500
                }
            )
        }
        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username})

        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message : "Username is Already Taken"
            },{status: 400});
        }

        return Response.json({
            success : true,
            message : "Username is unique"
        },{status: 200});

    } catch (error) {
        console.log("Error In Check Username Unique", error)
        return Response.json({
            success: false,
            message: "Error Checking Username Unique"
        },
            {
                status: 500
            }
        )
    
    }
}