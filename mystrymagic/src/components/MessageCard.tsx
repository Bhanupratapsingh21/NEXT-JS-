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
import { X } from "lucide-react"
import { Message } from "@/model/user.model"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
    message: Message
    onMessageDelete: (messageid: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const toast = useToast();
    const handledeleteConform = async() => {
       const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
       toast({
        title : response.data.message
       })
       onMessageDelete(messsage._id)
    };
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle></CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><X className="w-5 h-5" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handledeleteConform}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                   
                </CardContent>
                <CardFooter>
                    
                </CardFooter>
            </Card>
        </>
    )
}
export default MessageCard