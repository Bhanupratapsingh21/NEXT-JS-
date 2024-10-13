import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/SendVerificationemail";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbconnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedByUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User Already Exists"
                },
                {
                    status: 400
                }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "User Already Exists With This Email"
                    },
                    {
                        status: 400
                    }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: true,
                isAcceptingMessage: true,
                messages: []
            });
            await newUser.save();
        }
       
        /*const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            );
        }*/

        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully. Pls Login"
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.log("Error While Registering User", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error While Registering User"
            },
            {
                status: 500
            }
        );
    }
}
