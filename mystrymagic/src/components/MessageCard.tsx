import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import React from "react"
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Mail } from "lucide-react";
import { formatDistanceToNow, format } from 'date-fns';


interface Message extends Document {
    _id: string;
    content: string;
    anonymousname: string;
    createdAt: Date
}

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: any) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    console.log(message)
    const { toast } = useToast();
    const handleDeleteConfirm = async () => {
        try {
            toast({
                title: "Deleting MSG",
            });
            const response = await axios.delete<ApiResponse>(
                `/api/delete-message/${message._id}`
            );
            toast({
                title: response.data.message,
            });
            onMessageDelete(message._id.toString());
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }
    };
    const formatDate = (createdAt: string) => {
        const date = new Date(createdAt);
        const daysDifference = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDifference > 5) {
            // More than 5 days ago, return exact date with year
            return format(date, 'dd MMM yyyy');
        } else {
            // Less than 5 days ago, return relative time
            return formatDistanceToNow(date, { addSuffix: true });
        }
    };
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle><h2 className="h-14">Sender's Annonymous Name : {message.anonymousname}</h2></CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col text-white md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-white text-muted-foreground">
                            {formatDate(message.createdAt.toString())}

                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col md:flex-row gap-2 justify-between items-center w-full">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 md:max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2" variant="destructive">

                                    <span
                                        className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"
                                    ></span>
                                    <div className="flex items-center">

                                        <span className="ml-1 text-white">Delete</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm md:flex">
                                        <X className="w-5 h-5" />
                                    </div>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete This MSG
                                        and you can't Undo this.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <button

                            className="flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 md:max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
                        >
                            <span
                                className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"
                            ></span>
                            <div className="flex items-center">

                                <span className="ml-1 text-white">Share On Social</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm md:flex">
                                <svg
                                    className="fill-zinc-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M15.4306 7.70172C7.55045 7.99826 3.43929 15.232 2.17021 19.3956C2.07701 19.7014 2.31139 20 2.63107 20C2.82491 20 3.0008 19.8828 3.08334 19.7074C6.04179 13.4211 12.7066 12.3152 15.514 12.5639C15.7583 12.5856 15.9333 12.7956 15.9333 13.0409V15.1247C15.9333 15.5667 16.4648 15.7913 16.7818 15.4833L20.6976 11.6784C20.8723 11.5087 20.8993 11.2378 20.7615 11.037L16.8456 5.32965C16.5677 4.92457 15.9333 5.12126 15.9333 5.61253V7.19231C15.9333 7.46845 15.7065 7.69133 15.4306 7.70172Z"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    ></path></svg>
                            </div>
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}
export default MessageCard