"use client"
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast'; // Assuming toast is from ShadCN's UI library
import { z } from "zod";
import { MessagesSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import Image from 'next/image';

interface PageProps {
    params: {
        username: string;
    };
}

const Page = ({ params }: PageProps) => {
    const { toast } = useToast();
    const { username } = params;
    const designbg = [
        "bg-gradient-to-tr from-blue-500 to-purple-600",
        "bg-gradient-to-tr from-green-400 to-yellow-500",
        "bg-gradient-to-r from-pink-500 to-orange-500",
        "bg-gradient-to-bl from-indigo-500 to-cyan-500",
        "bg-gradient-to-br from-blue-400 to-purple-400 shadow-lg shadow-gray-200/50 overflow-hidden",
        "bg-gradient-to-tr from-[#4158d0] via-[#1888b4] to-[#0f31ca] shadow-[inset_0_-23px_25px_rgba(0,0,0,0.17),inset_0_-36px_30px_rgba(0,0,0,0.15),inset_0_-79px_40px_rgba(0,0,0,0.1),0_2px_1px_rgba(0,0,0,0.06),0_4px_2px_rgba(0,0,0,0.09),0_8px_4px_rgba(0,0,0,0.09),0_16px_8px_rgba(0,0,0,0.09),0_32px_16px_rgba(0,0,0,0.09)]",
        "bg-gradient-to-tr from-[#4158D0] via-[#C850C0] to-[#FFCC70] shadow-[inset_0_-23px_25px_rgba(0,0,0,0.17),inset_0_-36px_30px_rgba(0,0,0,0.15),inset_0_-79px_40px_rgba(0,0,0,0.1),0_2px_1px_rgba(0,0,0,0.06),0_4px_2px_rgba(0,0,0,0.09),0_8px_4px_rgba(0,0,0,0.09),0_16px_8px_rgba(0,0,0,0.09),0_32px_16px_rgba(0,0,0,0.09)]"
    ];

    const [rendomno, setRendomno] = useState(0);
    const [loading, setLoading] = useState(false); // Manage loading state
    const [suggestmsgloading, setsuggestmsgloading] = useState(false); // Manage loading state
    const [formData, setFormData] = useState({
        name: '',
        message: ''
    });

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * designbg.length); // Generate a random index
        setRendomno(randomIndex);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validate the form data
        const validationResult = MessagesSchema.safeParse(formData);
        if (!validationResult.success) {
            validationResult.error.errors.forEach(error => {
                toast({
                    title: "Validation Error",
                    description: error.message,
                    duration: 3000,
                    variant: "destructive",
                });
            });
            setLoading(false);
            return;
        }

        try {
            // Replace with your API endpoint
            const res = await axios.post('/api/send-message', {
                username,
                anonymousname: formData.name,
                content: formData.message,
            });

            if (res.status === 200) {
                toast({
                    title: "Message sent successfully!",
                    description: "Your anonymous message has been sent.",
                    duration: 3000,
                });
                setFormData({ name: '', message: '' }); // Reset form
            } else {
                toast({
                    title: "Error",
                    description: "There was an issue sending your message.",
                    duration: 3000,
                    variant: "destructive",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: `Error`,
                description: axiosError.response?.data.message || "Error While Sending MSG Pls Try Again",
                duration: 3000,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestMsg = async () => {
        try {
            setsuggestmsgloading(true);
            const res = await axios.get('/api/suggest-messages'); // API route to generate the message
            if (res.status === 200) {
                const { anonymesname, msg } = res.data;
                setFormData({
                    name: anonymesname,
                    message: msg,
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to get suggested message",
                    duration: 3000,
                    variant: "destructive",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Error fetching suggested message",
                duration: 3000,
                variant: "destructive",
            });
        } finally {
            setsuggestmsgloading(false);
        }
    };

    return (
        <div className={` max-w-screen pt-24 h-full ${designbg[rendomno]} flex justify-center items-center`}>
            <div className="max-w-md md:max-w-xl mx-auto relative overflow-hidden z-10 backdrop-blur-sm p-8 rounded-lg shadow-md ">
                <h1 className="text-2xl text-center  md:text-4xl mb-6 font-bold text-white">
                    Send MSG To {username}!
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">
                            Your Anonymous Name
                        </label>
                        <input
                            className="mt-1 text-white bg-transparent backdrop-blur-md p-2 w-full border rounded-md"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">
                            Your MSG
                        </label>
                        <textarea
                            className="mt-1 p-2 text-white backdrop-blur-md bg-transparent w-full border rounded-md"
                            rows={4}
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-center">
                        <button
                            className={`text-white px-4 py-2 font-bold backdrop-blur-sm border-white border-2 rounded-md hover:opacity-80 w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={loading || suggestmsgloading}
                        >
                            {loading ? 'Sending...' : 'Send MSG'}
                        </button>
                    </div>
                </form>

                <div className="flex justify-center pt-2">
                    <button
                        className="text-white px-4 py-2 font-bold border-white border-2 rounded-md w-full hover:opacity-80"
                        onClick={handleSuggestMsg}
                        disabled={loading || suggestmsgloading}
                    >
                        {suggestmsgloading ? 'Getting MSG By Ai...' : 'Suggest MSG'}
                    </button>
                </div>
                <div className="flex justify-center pt-2">
                    <button
                        className="text-white flex justify-center items-center px-4 py-2 font-bold border-white border-2 rounded-md w-full hover:opacity-80"
                    >
                        <Image
                            src="/logo.png"
                            alt="Whisper Box Logo"
                            width={20}
                            height={20}
                        />
                        <span className="ml-2">Get Your OWN</span>
                    </button>
                </div>
                <div className="text-center py-4 bottom-0">
                    <p className="text-white text-xs relative  font-Roboto-md">Powered By WhisperBox</p>
                    <p className="text-white text-xs relative  font-Roboto-md">by <a href="https://bhanu-pratap-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">@bhanu_pratap_2119</a></p>
                </div>
            </div>
        </div>
    );
};

export default Page;