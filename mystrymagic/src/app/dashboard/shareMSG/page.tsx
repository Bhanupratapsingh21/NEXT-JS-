"use client";
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/model/user.model';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';

interface Message {
    _id: string;
    content: string;
    anonymousname: string;
    createdAt: Date;
}

const ShareMSGDashboard = () => {
    const [designIndex, setDesignIndex] = useState(0);
    const { toast } = useToast();
    const [message, setMessage] = useState<Message | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showname, setshowname] = useState<boolean>(true);
    const router = useRouter();
    const { data: session } = useSession();
    const user: User = session?.user as User;
    const cardRef = useRef<HTMLDivElement>(null);

    const designBgs = [
        "bg-gradient-to-br from-pink-200 to-blue-400",
        "bg-gradient-to-tr from-blue-500 to-purple-600 text-white",
        "bg-gradient-to-tr from-green-400 to-yellow-500 text-white",
        "bg-gradient-to-r from-pink-500 to-orange-500 text-white",
        "bg-gradient-to-bl from-indigo-500 to-cyan-500 text-white",
        "bg-gradient-to-br from-blue-400 to-purple-400 text-white shadow-lg shadow-gray-200/50 overflow-hidden",
        "bg-gradient-to-tr from-[#4158d0] via-[#1888b4] text-white to-[#0f31ca] shadow-[inset_0_-23px_25px_rgba(0,0,0,0.17),inset_0_-36px_30px_rgba(0,0,0,0.15),inset_0_-79px_40px_rgba(0,0,0,0.1),0_2px_1px_rgba(0,0,0,0.06),0_4px_2px_rgba(0,0,0,0.09),0_8px_4px_rgba(0,0,0,0.09),0_16px_8px_rgba(0,0,0,0.09),0_32px_16px_rgba(0,0,0,0.09)]",
        "bg-gradient-to-tr from-[#4158D0] via-[#C850C0] text-white to-[#FFCC70] shadow-[inset_0_-23px_25px_rgba(0,0,0,0.17),inset_0_-36px_30px_rgba(0,0,0,0.15),inset_0_-79px_40px_rgba(0,0,0,0.1),0_2px_1px_rgba(0,0,0,0.06),0_4px_2px_rgba(0,0,0,0.09),0_8px_4px_rgba(0,0,0,0.09),0_16px_8px_rgba(0,0,0,0.09),0_32px_16px_rgba(0,0,0,0.09)]"
    ];

    useEffect(() => {
        if (session?.user) {
            getMsg();
        }
    }, [session]);

    const getMsg = useCallback(() => {
        setIsLoading(true);
        try {
            const sharedMessage = localStorage.getItem('sharedMessage');
            const parsedMessage = sharedMessage ? JSON.parse(sharedMessage) : null;
            if (parsedMessage) {
                setMessage(parsedMessage);
            } else {
                throw new Error("No message found in localStorage.");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to Fetch Message. Try Again",
                variant: "destructive",
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    const downloadImage = useCallback(async () => {
        if (cardRef.current) {
            try {
                const dataUrl = await toPng(cardRef.current);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'Whisper-box-message-card.png';
                link.click();
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to download image",
                    variant: "destructive",
                });
            }
        }
    }, [toast]);

    const toggleDesign = useCallback(() => {
        setDesignIndex((prevIndex) => (prevIndex + 1) % designBgs.length);
    }, []);

    if (!session?.user) {
        return <div className="pt-28 px-16 text-center text-black">Please Login</div>;
    }

    return (
        <div className="pt-12 md:pt-24 md:px-16 min-h-screen bg-gradient-to-br from-blue-400 to-purple-400">
            <main className="pt-10 md:flex md:justify-between flex  md:flex-row flex-col-reverse justify-center md:items-start">
                <div className=''>

                    <h1 className="text-xl hidden md:block md:text-4xl max-w-screen px-4 md:px-0 text-white font-bold mb-4">Share MSG On Social Media App's</h1>
                    <div className="gap-6 pb-4 px-4 my-4 md:mb-0 w-full">
                        <Button onClick={toggleDesign} className="w-full mt-4">
                            Toggle Color
                        </Button>
                        <Button onClick={() => { setshowname((prevState) => !prevState) }} className="w-full mt-4">
                            {showname ? "Hide" : "Show"} Name
                        </Button>
                        <Button
                            onClick={downloadImage}
                            className="flex items-center justify-center w-full  mt-4 gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Download IMG To Share
                        </Button>
                        <Button
                            onClick={()=> router.push("/dashboard")}
                            className="flex items-center justify-center w-full  mt-4 gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              Back
                        </Button>
                    </div>



                </div>
                <div className="flex flex-col justify-center items-center">

                    <div ref={cardRef} className={`relative w-[205px] h-[395px] bg-black rounded-[20px] ${designBgs[designIndex]}`}>
                        <div className="flex h-full justify-center items-center">
                            <div className="bg-white px-4 py-3 w-40 min-h-36 flex justify-center items-center rounded-lg">
                                <div className="card__content px-2">
                                    {showname && (<h2 className='text-sm w-full overflow-hidden text-center px-4 md:px-0 text-black font-bold mb-4'>By : {message?.anonymousname || "No message"}</h2>)}
                                    <h2 className='text-md w-full overflow-hidden text-center px-4 md:px-0 text-black font-bold mb-4'>{message?.content || "No message"}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default ShareMSGDashboard;