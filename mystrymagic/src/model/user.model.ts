import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    anonymousname: string;
    createdAt: Date
}
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    anonymousname: {
        type: String,
        required: true,
        default: "Anonymous" 
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now 
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[]
}


const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username Is Required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use A Vaild Email Addreas"]
    },
    password: {
        type: String,
    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code Is Required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expriry Is Required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema))

export default UserModel   