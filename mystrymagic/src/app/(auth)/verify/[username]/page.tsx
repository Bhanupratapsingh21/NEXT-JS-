"use client";
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Page = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post("/api/Verify-Code", {
                username: params.username,
                code: data.code
            });

            toast({
                title: "Success",
                description: response.data.message
            });

            router.replace('/sign-in');
        } catch (error) {
            console.log("Error in verifying user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Verification failed",
                description: axiosError.response?.data.message || "An error occurred during verification.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f89b29] to-[#ff0f7b] overflow-hidden'>
            <div className='w-full max-w-md p-8 space-y-8  rounded-lg shadow-md border-2 border-black'>
                <div className="text-center">
                    <h1 className="text-4xl text-white font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4 text-white ">Enter the verification code sent to your email</p>
                </div>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Code" maxLength={6} minLength={6} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default Page;
