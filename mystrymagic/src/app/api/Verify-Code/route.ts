import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signupSchema";

export async function POST(request: Request) {
    await dbconnect();
    try {
        const { username, code } = await request.json();
        const decodeUsername = decodeURIComponent(username)
        console.log(decodeUsername)
        const User = await UserModel.findOne({
            username: decodeUsername
        })
        if (!User) {
            return Response.json({
                success: false,
                message: "User not Found"
            },
                {
                    status: 404
                })
        }
        const isCodeVaild = User.verifyCode === code
        const isCodeNotExpired = new Date(User.verifyCodeExpiry) > new Date()
        if (isCodeVaild && isCodeNotExpired) {
            User.isVerified = true
            await User.save();
            return Response.json({
                success: true,
                message: "Account Verified Successfully"
            },
                {
                    status: 200
                })
        }else if (!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification Code Has Expired Pls Signup again to get a new code"
            },
            {
                status: 500
            })
        }else{
            return Response.json({
                success: false,
                message: "Incorrect Verification Code"
            },
            {
                status: 500
            })
        }

    } catch (error) {
        console.log("Error In Verifying User", error)
        return Response.json(
            {
                success: false,
                message: "Error In Verifying User"
            },
            {
                status: 500
            }
        )
    }
}