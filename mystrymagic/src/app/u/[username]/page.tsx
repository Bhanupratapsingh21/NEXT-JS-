"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast'; // Assuming toast is from ShadCN's UI library
import { z } from "zod";
import { MessagesSchema } from '@/schemas/messageSchema'
interface PageProps {
    params: {
        username: string;
    };
}

// Define the zod schema for validation


const Page = ({ params }: PageProps) => {
    const { toast } = useToast();
    const { username } = params;
    const designbg = [
        "bg-gradient-to-tr from-blue-500 to-purple-600",
        "bg-gradient-to-tr from-green-400 to-yellow-500",
        "bg-gradient-to-r from-pink-500 to-orange-500",
        "bg-gradient-to-bl from-indigo-500 to-cyan-500",
        "bg-gradient-to-br from-blue-400 to-purple-400 shadow-lg shadow-gray-200/50 overflow-hidden",
        "bg-white overflow-hidden cursor-pointer text-white  before:absolute before:w-full before:h-full before:blur-[20px] before:bg-[#faff99] before:bg-[radial-gradient(at_33%_82%,_hsla(254,71%,69%,1)_0px,_transparent_50%),radial-gradient(at_28%_4%,_hsla(289,96%,63%,1)_0px,_transparent_50%),radial-gradient(at_69%_49%,_hsla(309,91%,71%,1)_0px,_transparent_50%),radial-gradient(at_94%_14%,_hsla(232,66%,62%,1)_0px,_transparent_50%),radial-gradient(at_19%_93%,_hsla(51,98%,74%,1)_0px,_transparent_50%),radial-gradient(at_15%_80%,_hsla(194,87%,63%,1)_0px,_transparent_50%),radial-gradient(at_56%_52%,_hsla(109,71%,61%,1)_0px,_transparent_50%)] after:bg-[rgba(255,255,255,0.5)]",
        "bg-gradient-to-tr from-[#4158d0] via-[#1888b4] to-[#0f31ca] shadow-[inset_0_-23px_25px_rgba(0,0,0,0.17),inset_0_-36px_30px_rgba(0,0,0,0.15),inset_0_-79px_40px_rgba(0,0,0,0.1),0_2px_1px_rgba(0,0,0,0.06),0_4px_2px_rgba(0,0,0,0.09),0_8px_4px_rgba(0,0,0,0.09),0_16px_8px_rgba(0,0,0,0.09),0_32px_16px_rgba(0,0,0,0.09)]",
        "bg-gradient-to-tr from-[#4158D0] via-[#C850C0] to-[#FFCC70] shadow-[inset_0_-23px_25px_rgba(0,0,0,0.17),inset_0_-36px_30px_rgba(0,0,0,0.15),inset_0_-79px_40px_rgba(0,0,0,0.1),0_2px_1px_rgba(0,0,0,0.06),0_4px_2px_rgba(0,0,0,0.09),0_8px_4px_rgba(0,0,0,0.09),0_16px_8px_rgba(0,0,0,0.09),0_32px_16px_rgba(0,0,0,0.09)]"
    ];

    const [rendomno, setRendomno] = useState(0);
    const [loading, setLoading] = useState(false); // Manage loading state
    const [formData, setFormData] = useState({
        name: '',
        message: ''
    });

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
                anonymousname : formData.name,
                content : formData.message,
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
            toast({
                title: "Error",
                description: "Failed to send message, please try again.",
                duration: 3000,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`w-screen pt-24 h-screen ${designbg[rendomno]} flex justify-center items-center`}>
            <div className="max-w-md mx-auto relative overflow-hidden z-10 backdrop-blur-sm p-8 rounded-lg shadow-md ">
                <h1 className="text-4xl mb-6 font-bold text-white">
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
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send MSG'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Page;
