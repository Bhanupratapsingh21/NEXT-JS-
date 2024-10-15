import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user.model';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    // Extract query parameters for pagination (default to page 1 and limit 10)
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const skip = (page - 1) * limit; // Number of items to skip

    try {
        // Aggregate query with pagination
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },  // Preserve users without messages
            { $sort: { 'messages.createdAt': -1 } },  // Sort messages by creation date
            { $skip: skip },  // Skip the specified number of messages
            { $limit: limit },  // Limit the number of messages returned
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },  // Regroup messages into an array
        ]).exec();

        if (!user || user.length === 0) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        // Get the total number of messages for pagination
        const totalMessages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },
            { $count: 'total' }
        ]);

        const total = totalMessages[0]?.total || 0;  // Total number of messages

        return Response.json(
            {
                messages: user[0].messages,
                pagination: {
                    total, 
                    page,  
                    limit, 
                    totalPages: Math.ceil(total / limit)
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
