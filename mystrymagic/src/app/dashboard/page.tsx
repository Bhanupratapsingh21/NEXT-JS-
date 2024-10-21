'use client';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/model/user.model';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { ApiResponse as ApiResponse2 } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from '@/components/MessageCard';
import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';
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
    const [msg, setmsg] = useState("ASK Me Anything")
    const [no, setno] = useState(3);
    const designbg = [
        "bg-gradient-to-br from-pink-200 to-blue-400",
        "bg-gradient-to-tr from-blue-500 to-purple-600 text-white",
        "bg-gradient-to-tr from-green-400 to-yellow-500 text-white",
        "bg-gradient-to-r from-pink-500 to-orange-500 text-white",
        "bg-gradient-to-bl from-indigo-500 to-cyan-500 text-white",
        "bg-gradient-to-br from-blue-400 to-purple-400 text-white shadow-lg shadow-gray-200/50 overflow-hidden",
        "bg-gradient-to-tr from-[#4158d0] via-[#1888b4] text-white to-[#0f31ca] shadow-[inset_0_-23px_25px_rgba(0,0,0,0.17),inset_0_-36px_30px_rgba(0,0,0,0.15),inset_0_-79px_40px_rgba(0,0,0,0.1),0_2px_1px_rgba(0,0,0,0.06),0_4px_2px_rgba(0,0,0,0.09),0_8px_4px_rgba(0,0,0,0.09),0_16px_8px_rgba(0,0,0,0.09),0_32px_16px_rgba(0,0,0,0.09)]",
        "bg-gradient-to-tr from-[#4158D0] via-[#C850C0] text-white to-[#FFCC70] shadow-[inset_0_-23px_25px_rgba(0,0,0,0.17),inset_0_-36px_30px_rgba(0,0,0,0.15),inset_0_-79px_40px_rgba(0,0,0,0.1),0_2px_1px_rgba(0,0,0,0.06),0_4px_2px_rgba(0,0,0,0.09),0_8px_4px_rgba(0,0,0,0.09),0_16px_8px_rgba(0,0,0,0.09),0_32px_16px_rgba(0,0,0,0.09)]"
    ];

    const router = useRouter();
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

    const onMessageShare = useCallback((shareMsgId: string) => {
        const messageToShare = messages.find(message => message._id === shareMsgId);

        if (messageToShare) {
            if (localStorage.getItem("sharedMessage")) localStorage.removeItem("sharedMessage")
            localStorage.setItem('sharedMessage', JSON.stringify(messageToShare));
        }
        router.push("/dashboard/shareMSG");
    }, [messages]);

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

    const cardRef = useRef<HTMLDivElement>(null);

    const downloadImage = async () => {
        if (cardRef.current) {
            try {
                // Increase the scale to improve quality
                const dataUrl = await toPng(cardRef.current);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'Whisper-box-message-card.png';
                link.click();
                copyToClipboard();
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to download image",
                    variant: "destructive",
                });
            }
        }
    };

    useEffect(() => {
        calculatePageRange(page, totalPages);
    }, [page, totalPages]);

    if (!session?.user) {
        return <div className="pt-28 min-h-screen bg-gradient-to-br from-blue-400 to-purple-400 px-16 text-center text-black">Please Login</div>;
    }

    return (
        <div className="pt-12 md:pt-24 md:px-16 min-h-screen bg-gradient-to-br from-blue-400 to-purple-400">
            <main className="pt-10 md:flex md:justify-between flex  md:flex-row flex-col-reverse justify-center md:items-start">
                <div>

                    <h1 className="text-xl hidden md:block md:text-4xl max-w-screen px-4 md:px-0 text-white font-bold mb-4">{user.username}&apos;s Dashboard</h1>

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
                            <span className="ml-2 text-white">Accept Messages: {acceptMessages ? "On" : "Off"}</span>
                        </div>
                        <button
                            onClick={downloadImage}
                            className="flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 md:max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
                        >
                            <span
                                className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"
                            ></span>
                            <div className="flex items-center">

                                <span className="ml-1 text-white">Download IMG To Share</span>
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
                        <br />
                        <button
                            disabled={isLoading}
                            onClick={() => fetchMessages(page)}
                            className="flex mt-4 md:w-max overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 md:max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
                        >
                            <span
                                className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"
                            ></span>
                            <div className="flex items-center">

                                <span className="ml-1 text-white">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm md:flex">

                            </div>
                        </button>

                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">

                    <h1 className="text-xl md:hidden block md:text-4xl max-w-screen px-4 md:px-0 text-white font-bold mb-4">{user.username}&apos;s Dashboard</h1>
                    <div ref={cardRef} className="relative w-[205px] h-[395px] bg-black rounded-[20px]">
                        {/* we have to download this whole div */}
                        <div className={` ${designbg[no]}  absolute z-5 top-1 left-1 right-1 bottom-2  rounded-[20px]`}>

                            <div className="flex h-full justify-center items-center">
                                <div className="bg-white z-8 px-4 py-3 w-40 h-36 rounded-lg">
                                    <div className="card__content px-2">
                                        <h2 className="text-md w-full overflow-hidden text-center px-4 md:px-0 text-black font-bold mb-4">{msg}</h2>
                                        <button

                                            className="flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 md:max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
                                        >
                                            <span
                                                className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"
                                            ></span>
                                            <div className="flex items-center">

                                                <span className="ml-1 text-white">Link</span>
                                            </div>

                                        </button>
                                    </div>
                                </div>
                                <div className="absolute text-center pb-1 bottom-0 z-10">
                                    <p className="text-white text-xs relative  font-Roboto-md">Powered By WhisperBox</p>
                                    <p className="text-white text-xs relative  font-Roboto-md">by <a href="https://bhanu-pratap-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">@bhanu_pratap_2119</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:px-0 px-4 mb-3 md:mb-0 w-full">
                        <h1 className="text-xl mt-4 md:hidden block md:text-4xl px-4 md:px-0 text-white font-bold mb-4">Share On Social Media App&apos;s</h1>
                        <button
                            onClick={() => setno((pravno) => pravno >= designbg.length - 1 ? 0 : pravno + 1)}
                            className="flex mt-4  overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2  whitespace-pre md:flex group relative w-full justify-center  rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
                        >
                            <span
                                className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"
                            ></span>
                            <div className="flex items-center">

                                <span className="ml-1 text-white">Toggle Color</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm md:flex">

                            </div>
                        </button>
                        <input
                            type="text"
                            value={msg}
                            onChange={(e) => setmsg(e.target.value)}
                            className="p-2 mt-4 rounded-md w-full"
                        />
                    </div>
                </div>

            </main>
            <main className="pt-10">
                <h1 className="text-xl md:text-4xl px-4 md:px-0 text-white font-bold mb-4">MSG&apos;S</h1>
                <div className={`mt-4 px-4 ${messages.length > 0 ? "grid-cols-1 xl:grid-cols-2" : ""} py-4 grid text-white gap-6`}>
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageCard
                                key={message._id}
                                message={message}
                                onMessageDelete={() => handleMessageDelete(message._id)}
                                onMessageShare={() => onMessageShare(message._id)}
                            />
                        ))
                    ) : (
                        <p className="text-white flex justify-center items-center text-center md:px-0 px-4">No messages to display.</p>
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