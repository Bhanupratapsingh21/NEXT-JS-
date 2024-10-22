import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user.model';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import { NextResponse } from 'next/server'; // Ensure you import NextResponse

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const messageId = params.messageId;
    //console.log(messageId);
    
    // Connect to the database
    await dbConnect();
    
    // Get the user session
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    // Check if the user is authenticated
    if (!session || !_user) {
        return NextResponse.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        // Delete the message from the user's messages
        const updateResult = await UserModel.updateOne(
            { _id: _user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        
        //console.log(updateResult);

        // Check if the message was successfully deleted
        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'Message Not Found or Already deleted' },
                { status: 404 }
            );
        }

        // Return success response
        return NextResponse.json(
            { success: true, message: 'Message deleted successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.log(error, "Error while deleting message");
        return NextResponse.json(
            { success: false, message: "Error while deleting message" },
            { status: 500 }
        );
    }
}
