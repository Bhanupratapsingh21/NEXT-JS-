"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react'; // OAuth sign-in

const Page = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || "Error Checking Username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!username) return "Username is required";
    if (!email || !validateEmail(email)) return "Please enter a valid email address";
    if (!password) return "Password is required";
    if (usernameMessage !== 'Username is unique') return "Username must be unique";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors) {
      toast({
        title: "Error",
        description: validationErrors,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', { username, email, password });
      toast({
        title: "Success",
        description: response.data.message
      });
      router.replace(`/sign-in`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "Signup failed. Please try again.";
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f89b29] to-[#ff0f7b] overflow-hidden">
      <div className="w-full max-w-md mt-20 p-6 space-y-4 md:border-2 md:border-black shadow-[4px_4px_0px_0px_black] rounded-lg">
        <div className="text-center text-white">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">
            Join <br /> Whisper-Box
          </h1>
          <p className="mb-2">Where Your Identity Remains Secret</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block font-bold mb-2 text-white" htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                debounced(e.target.value);
              }}
            />
            {!isCheckingUsername && usernameMessage && (
              <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-blue-500' : 'text-red-900'}`}>
                {usernameMessage}
              </p>
            )}
          </div>
          <div>
            <label className="block font-bold mb-2 text-white" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
          </div>
          <div>
            <label className="block font-bold mb-2 text-white" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className='w-full' disabled={isSubmitting}>
            {(isSubmitting || isCheckingUsername) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
        <button onClick={async () => {
          
          const result = await signIn('google', { redirect: true, callbackUrl: '/' });
          
          //console.log('Google sign-in result:', result);
        }} className="oauthButton  w-full flex border-2 border-black shadow-[4px_4px_0px_0px_black] justify-center items-center gap-1 px-4 py-3 h-[40px] rounded-md  text-[16px] font-semibold text-font-color cursor-pointer transition-all duration-250 relative overflow-hidden z-10">
          <svg className="icon bg-white rounded-full p-1 w-6 h-6" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            <path d="M1 1h22v22H1z" fill="none"></path>
          </svg>
          Continue with Google
        </button>

        <button onClick={async () => {
         
          const result = await signIn('github', { redirect: true, callbackUrl: '/' });
          
          //console.log('GitHub sign-in result:', result);
        }}
          className="oauthButton border-2 w-full border-black shadow-[4px_4px_0px_0px_black] flex justify-center items-center gap-1 px-4 py-3  h-[40px] rounded-md  border-main-color bg-bg-color  text-[16px] font-semibold text-font-color cursor-pointer transition-all duration-250 relative overflow-hidden z-10">
          <svg className="icon bg-white rounded-full p-1 w-6 h-6" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
          </svg>
          Continue with Github
        </button>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
