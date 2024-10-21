'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Autoplay from 'embla-carousel-autoplay';
import { Mail } from "lucide-react";

export default function Home() {
  const massages = [
    {
      "title": "Message from Your EX ??",
      "content": "Hey, how are you doing today?",
      "received": "10 minutes ago"
    },
    {
      "title": "Message from SecretAdmirer",
      "content": "I really like you Are You Single?",
      "received": "2 hours ago"
    },
    {
      "title": "Message from MysteryGuest",
      "content": "Do you have any Crush?",
      "received": "1 day ago"
    },
    {
      "title": "Message from human21352",
      "content": "you fav movie?",
      "received": "1 min ago"
    },
  ]

  const designbg = [
    "bg-gradient-to-tr from-blue-500 to-purple-600 text-white", // Example background styles
    "bg-gradient-to-tr from-green-400 to-yellow-500 text-white",
    "bg-gradient-to-r from-pink-500 to-orange-500 text-white",
    "bg-gradient-to-bl from-indigo-500 to-cyan-500 text-white",
    "bg-gradient-to-br from-blue-400 to-purple-400 text-white shadow-lg shadow-gray-200/50 overflow-hidden",
    "bg-gradient-to-tr from-[#4158d0] via-[#1888b4] text-white to-[#0f31ca] shadow-[inset_0_-23px_25px_rgba(0,0,0,0.17),inset_0_-36px_30px_rgba(0,0,0,0.15),inset_0_-79px_40px_rgba(0,0,0,0.1),0_2px_1px_rgba(0,0,0,0.06),0_4px_2px_rgba(0,0,0,0.09),0_8px_4px_rgba(0,0,0,0.09),0_16px_8px_rgba(0,0,0,0.09),0_32px_16px_rgba(0,0,0,0.09)]",
    "bg-gradient-to-tr from-[#4158D0] via-[#C850C0] text-white to-[#FFCC70] shadow-[inset_0_-23px_25px_rgba(0,0,0,0.17),inset_0_-36px_30px_rgba(0,0,0,0.15),inset_0_-79px_40px_rgba(0,0,0,0.1),0_2px_1px_rgba(0,0,0,0.06),0_4px_2px_rgba(0,0,0,0.09),0_8px_4px_rgba(0,0,0,0.09),0_16px_8px_rgba(0,0,0,0.09),0_32px_16px_rgba(0,0,0,0.09)]"
  ];

  const [rendomno, setRendomno] = useState(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * designbg.length); // Generate a random index
    setRendomno(randomIndex);
  }, []);

  return (
    <>
      <div className={`w-screen h-full md:h-screen ${designbg[rendomno]}`}>
        <main className="flex-grow pt-36 md:pt-48  flex flex-col items-center justify-center px-4 md:px-24 py-24 ">
          <section className="text-center mb-8 md:mb-12">
            <div
              className="mx-auto w-full  flex flex-col items-center justify-center text-center overflow-visible"
            >
              <h3 className="md:text-5xl text-2xl z-50 mb-2 font-bold">Dive into the World of Anonymous Feedback</h3>
              <div className="w-full relative flex flex-col items-center justify-center">
                <div
                  className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-full blur-sm"
                ></div>
                <div
                  className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-full"
                ></div>
                <div
                  className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent h-[5px] w-1/2 blur-sm"
                ></div>
                <div
                  className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent h-px w-1/2"
                ></div>
                <div

                  className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(50%_200px_at_top,transparent_20%,white)]"
                ></div>
              </div>
              <p className="mt-3 text-md md:text-lg">
                WhisperBox - Where your identity remains a secret.
              </p>

              <span
                className="absolute -z-[1] backdrop-blur-sm inset-0 w-full h-full flex before:content-[''] before:h-3/4 before:w-full before:bg-gradient-to-r before:from-black before:to-purple-600 before:blur-[90px] after:content-[''] after:h-1/2 after:w-full after:bg-gradient-to-br after:from-cyan-400 after:to-sky-300 after:blur-[90px]"
              ></span>
            </div>

          </section>

          {/* Carousel for Messages */}
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full px-2 md:max-w-xl"
          >
            <CarouselContent>
              {massages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-white text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </main>
      </div>
    </>
  );
}
