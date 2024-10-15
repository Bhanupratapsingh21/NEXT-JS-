'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {  User } from '@/model/user.model';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { ApiResponse as ApiResponse2 } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from '@/components/MessageCard';

interface Message extends Document {
    _id: string;
    content: string;
    anonymousname: string;
    createdAt: Date
}

interface ApiResponse {
    messages: Message[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface AcceptMessagesResponse {
    isAcceptingMessages: boolean;
}

interface UpdateAcceptMessagesResponse {
    message: string;
}

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [acceptMessages, setAcceptMessages] = useState(false);
    const [currentPageRange, setCurrentPageRange] = useState<number[]>([]);

    const { toast } = useToast();
    const { data: session } = useSession();
    const user: User = session?.user as User;

    const handleMessageDelete = useCallback((deletedMessageId: string) => {
        setMessages(prevMessages => prevMessages.filter(message => message._id !== deletedMessageId));
    }, []);

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<AcceptMessagesResponse>(
                "/api/accept-messages",
                { withCredentials: true }
            );
            setAcceptMessages(response.data.isAcceptingMessages);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse2>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch messages",
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [toast]);

    const fetchMessages = useCallback(async (pageNum: number) => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>(
                `/api/get-messages?page=${pageNum}&limit=5`,
                { withCredentials: true }
            );
            setMessages(response.data.messages);
            setTotalPages(response.data.pagination.totalPages);
            setPage(response.data.pagination.page);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse2>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to fetch messages",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (session?.user) {
            fetchAcceptMessage();
            fetchMessages(page);
        }
    }, [session, fetchMessages, fetchAcceptMessage, page]);

    const handleSwitchChange = async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.post<UpdateAcceptMessagesResponse>(
                '/api/accept-messages',
                { acceptMessages: !acceptMessages }
            );
            setAcceptMessages(!acceptMessages);
            toast({
                title: response.data.message,
                variant: "default",
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse2>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to update message settings",
                variant: "destructive",
            });
        } finally {
            setIsSwitchLoading(false);
        }
    };

    const copyToClipboard = () => {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        const profileUrl = `${baseUrl}/u/${user.username}`;
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: 'URL Copied!',
            description: 'Profile URL has been copied to clipboard.',
        });
    };

    const calculatePageRange = (current: number, total: number) => {
        const range: number[] = [];
        const start = Math.max(current - 4, 1); // Start at most 4 pages before current
        const end = Math.min(start + 9, total); // Show a maximum of 10 pages

        for (let i = start; i <= end; i++) {
            if (i <= total) range.push(i);
        }
        setCurrentPageRange(range);
    };

    useEffect(() => {
        calculatePageRange(page, totalPages);
    }, [page, totalPages]);

    if (!session?.user) {
        return <div className="pt-24 px-16 text-center text-black">Please Login</div>;
    }

    return (
        <div className="pt-12 md:pt-24 md:px-16 min-h-screen bg-gradient-to-br from-blue-400 to-purple-400">
            <main className="pt-10">
                <h1 className="text-xl md:text-4xl max-w-screen px-4 md:px-0 text-white font-bold mb-4">{user.username}'s Dashboard</h1>

                <div className="mb-4 px-4 md:px-0">
                    <h2 className="text-md md:text-lg text-white font-semibold mb-2">Copy Your Unique Link</h2>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={`${window.location.protocol}//${window.location.host}/u/${user.username}`}
                            readOnly
                            className="p-2 w-96 mr-2"
                        />
                        <Button onClick={copyToClipboard}>Copy</Button>
                    </div>
                </div>

                <div className="mb-4 px-4 md:px-0 flex flex-col items-left">
                    <div className="mb-4 flex items-center">
                        <Switch
                            checked={acceptMessages}
                            onCheckedChange={handleSwitchChange}
                            disabled={isSwitchLoading}
                        />
                        <span className="ml-2 text-white">Accept Messages: {acceptMessages ? 'On' : 'Off'}</span>
                    </div>
                    <Button
                        className="mt-4  w-full md:w-max"
                        variant="outline"
                        onClick={() => fetchMessages(page)}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                    </Button>
                </div>



                <div className="mt-4 px-4 py-4 grid text-white grid-cols-1 xl:grid-cols-2 gap-6">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageCard
                                message={message}
                                onMessageDelete={() => handleMessageDelete(message._id)}
                            />
                        ))
                    ) : (
                        <p className="text-white text-center md:px-0 px-4">No messages to display.</p>
                    )}
                </div>

                <div className="py-6 flex justify-center gap-2">
                    <Button
                        disabled={page === 1}
                        onClick={() => fetchMessages(page - 1)}
                    >
                        -
                    </Button>
                    {currentPageRange.map((pageNum) => (
                        <Button
                            key={pageNum}
                            onClick={() => fetchMessages(pageNum)}
                            variant={page === pageNum ? "default" : "outline"}
                        >
                            {pageNum}
                        </Button>
                    ))}
                    <Button
                        disabled={page === totalPages}
                        onClick={() => fetchMessages(page + 1)}
                    >
                        +
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
