import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { Profile } from "next-auth";

const GITHUB_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbconnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    });

                    if (!user) {
                        throw new Error("No User Found With this Email");
                    }
                    if (!user.isVerified) {
                        throw new Error("Please Verify Your Account Before Login");
                    }
                    if(user.password === null){
                        throw new Error("User With This Email Already Exist With OAuth Pls Login With OAuth")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return { ...user.toObject(), password: undefined }; // Return user without password
                    } else {
                        throw new Error("Incorrect Password");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        }),
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID as string,
            clientSecret: GOOGLE_CLIENT_SECRET as string,
        }),
        GithubProvider({
            clientId: GITHUB_CLIENT_ID as string,
            clientSecret: GITHUB_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }: { user: any; account: any; profile?: Profile }) {
            await dbconnect();
            if (account?.provider === 'google' || account?.provider === 'github') {
                try {
                    const existingUser = await UserModel.findOne({ email: user.email });

                    const firstName = (profile as any)?.given_name || user.email?.split('@')[0] || 'user';

                    const generateUniqueUsername = async (baseName: string): Promise<string> => {
                        let username;
                        let isUnique = false;

                        baseName = baseName.replace(/\s+/g, '').toLowerCase();

                        while (!isUnique) {
                            const randomNumber = Math.floor(1000 + Math.random() * 9000);
                            username = `${baseName}${randomNumber}`;

                            const userWithSameUsername = await UserModel.findOne({ username });
                            if (!userWithSameUsername) {
                                isUnique = true;
                            }
                        }
                        return username!;
                    };

                    let username;

                    if (!existingUser) {
                        username = await generateUniqueUsername(firstName);
                        const expiryDate = new Date();
                        expiryDate.setHours(expiryDate.getHours() - 1);
                        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

                        const newUser = await UserModel.create({
                            email: user.email,
                            username: username,
                            password: null,
                            verifyCode,
                            verifyCodeExpiry: expiryDate,
                            isVerified: true,
                            isAcceptingMessages: true,
                            messages: []
                        });

                        user._id = (newUser as any)._id?.toString();
                        user.username = username;
                    } else {
                        if (!existingUser.username) {
                            username = await generateUniqueUsername(firstName);
                            existingUser.username = username;
                            await existingUser.save();
                        } else {
                            username = existingUser.username;
                        }

                        user._id = (existingUser as any)._id?.toString();
                        user.username = username;
                    }

                    return true;
                } catch (error) {
                    console.error("Error during OAuth sign-in:", error);
                    return false;
                }
            }
            
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username || '';
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
};