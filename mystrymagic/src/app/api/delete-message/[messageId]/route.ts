import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user.model';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid
    // connect data base 
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User

    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: _user._id },
            { $pull: { messages: { _id: messageId } } }
        )
        if (updateResult.modifiedCount === 0) {
            return Response.json(
                { success: false, message: 'Message Not Found or Already deleted' },
                { status: 404 }
            );
        }

    } catch (error) {
        console.log(error, "Error while deleteing msg")
        return Response.json(
            { success: false, message: "Error While Deleteing Msg's" },
            { status: 501 }
        );
    }
}