'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Message, User } from '@/model/user.model'
import { AcceptMessagesSchema } from '@/schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'

const Page = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsloading] = useState(false);
    const [isSwitchLoading, setIsSwitchlaoding] = useState(false)

    const { toast } = useToast();

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message["_id"] !== messageId))
    }

    const { data: session } = useSession()
    const user: User = session?.user as User
    console.log(user);
    const form = useForm({
        resolver: zodResolver(AcceptMessagesSchema),
    });

    const { register, watch, setValue } = form;

    const acceptMessages = watch("acceptMessages")

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchlaoding(true)
        try {
            const response = await axios.get<ApiResponse>("/api/accept-messages", { withCredentials: true })
            setValue("acceptMessages", response.data.isAcceptingMessages);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch Message Settings"
            })
            console.log("Error While Fetch Accpeting Message", error)
        } finally {
            setIsSwitchlaoding(false);
        }

    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean) => {

        setIsloading(true);
        setIsSwitchlaoding(false);
        try {

            const response = await axios.get<ApiResponse>('/api/get-messages', { withCredentials: true })
            console.log(response)
            setMessages(response.data.messages);
            if (refresh) {
                toast({
                    title: "Refreshed Msg's",
                    description: "Showing Letest Msg's"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            console.log(error);
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch Message Settings"
            })
            console.log("Error While Fetch Accpeting Message", error)
        } finally {
            setIsloading(false);
            setIsSwitchlaoding(false);
        }
    }, [setIsloading, setIsSwitchlaoding])

    useEffect(() => {
        if (!session || !session.user) return
        fetchAcceptMessage();
        fetchMessages(true);

    }, [session, setValue, fetchMessages, fetchAcceptMessage])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })
            console.log(response)
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response.data.message,
                variant: "default",

            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch Message Settings",
                variant: "destructive"
            })
            console.log("Error While Fetch Accpeting Message", error)
        } finally {
            setIsloading(false);
            setIsSwitchlaoding(false);
        }
    }

    if (!session || !session.user) {
        return (
            <div>
                pls login
            </div>
        )
    }


    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${user.username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: 'URL Copied!',
            description: 'Profile URL has been copied to clipboard.',
        });
    };
    return (
        <div className="pt-24 px-16 relative h-screen  w-screen max-w-screen bg-gradient-to-br from-blue-400 to-purple-400 shadow-lg shadow-gray-200/50 overflow-hidden ">
            <main className=" relative pt-10 flex flex-col justify-left">
                <h1 className="text-4xl text-white w-max font-bold mb-4">{user.username}'s Dashboard</h1>

                <div className="mb-4  w-max max-w-screen" >
                    <h2 className="text-lg  text-white font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={profileUrl}
                            disabled
                            className="input input-bordered w-full p-2 mr-2"
                        />
                        <Button onClick={copyToClipboard}>Copy</Button>
                    </div>
                </div>

                <div className="mb-4 w-max flex  items center justify-center max-w-screen">
                    <Switch
                        {...register('acceptMessages')}
                        checked={acceptMessages}
                        onCheckedChange={handleSwitchChange}
                        disabled={isSwitchLoading}
                    />
                    <span className="ml-2 text-white">
                        Accept Messages: {acceptMessages ? 'On' : 'Off'}
                    </span>
                </div>

                <Button
                    className="mt-4 w-max"
                    variant="outline"
                    onClick={(e) => {
                        e.preventDefault();
                        fetchMessages(true);
                    }}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCcw className="h-4 w-4" />
                    )}
                </Button>
                <div className="mt-4 grid grid-cols-1 text-black  w-max md:grid-cols-2 gap-6">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <MessageCard
                                key={index}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))
                    ) : (
                        <p>No messages to display.</p>
                    )}
                </div>
            </main>
        </div>
    )
}
export default Page