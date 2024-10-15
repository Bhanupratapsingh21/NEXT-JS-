import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth"

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Founed"
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: acceptMessages ? "Now You Are Accepting New MSG'S" : "Now You Are Not Accepting New MSG'S"
            },
            {
                status: 201
            }
        )

    } catch (error) {
        console.log("Failed to update User status for accepting Messages", error);
        return Response.json(
            {
                success: false,
                message: "Failed to update User status for Accepting Messages"
            },
            {
                status: 501
            }
        )
    }

}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Founed"
                },
                {
                    status: 404
                }
            )
        }
       // console.log(foundUser.isAcceptingMessages);
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
                message: "User is Accepting New Message"
            },
            {
                status: 201
            }
        )
    } catch (error) {
        console.log("Failed to Fetch User to check Accepting Messages", error);
        return Response.json(
            {
                success: false,
                message: "Failed to Fetch User to check Accepting Messages"
            },
            {
                status: 501
            }
        )
    }
}