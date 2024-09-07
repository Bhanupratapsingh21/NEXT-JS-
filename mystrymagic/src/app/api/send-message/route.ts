import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";
import dbconnect from "@/lib/dbConnect";


export async function POST(request: Request) {
    await dbconnect();

    const { username, content } = await request.json()
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Found"
                },
                {
                    status: 404
                }
            )
        }

        // check user is accepting msg or not 
        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Found"
                },
                {
                    status: 403
                }
            )
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save();
        return Response.json(
            {
                success: true,
                message: "Message Send Successfully"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error While getting Msgs")
        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            {
                status: 501
            }
        )
    }
}