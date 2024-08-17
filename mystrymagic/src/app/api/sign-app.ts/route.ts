import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/SendVerificationemail"

export async function Post(request: Request) {
    await dbconnect()
    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "User Is Already Exist"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User Already Exist With This Email"
                    },
                    {
                        status: 400
                    }
                )
            } else {
                const hashedPasssword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPasssword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.password = new Date(Date.now() + 3600000).toString()
                await existingUserByEmail.save();
            }
        } else {
            const hashedPasssword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                hashedPasssword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
            await newUser.save();

        }

        // send verification email 
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: false,
                message: "User registered Successfully, Please Verify Email"
            },
            {
                status: 200
            }
        )


    } catch (error) {
        console.log("Error While Registering User", error)
        return Response.json(
            {
                success: false,
                message: "Error While Registering User"
            },
            {
                status: 500
            }
        )
    }
}