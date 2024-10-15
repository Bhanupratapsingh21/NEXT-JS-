"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
    const { data: session } = useSession();

    const user: User = session?.user as User



    return (
        <nav className="max-w-full w-full backdrop-blur-sm md:px-14 absolute z-50 ">
            <div className="max-w-full w-full border-black text-white pt-2 md:pt-5 relative overflow-hidden">
                <div className="flex max-w-screen justify-between px-2 md:px-4 items-center">
                    <Link href={"/"}>
                        <div>
                            <span className="brutal-subscribe__title block text-xl md:text-4xl font-bold relative z-10 text-shadow-[3px_3px_0_rgb(140,140,19)]">Whisper-Box</span>
                            <span className="brutal-subscribe__subtitle block text-sm relative z-10">Shhh... Your identity remains a secret.</span>
                        </div>
                    </Link>
                    <div className=''> {session ? (

                        <div className="flex items-center justify-center">
                            <span className="mr-4 hidden md:block">
                                Welcome, {user?.username || user?.email}
                            </span>
                            <div onClick={() => signOut()} className="w-[100px] h-[40px]">
                                <button
                                    id="space-btn"
                                    name="space-button"
                                    type="submit"
                                    className="relative w-full h-full bg-gradient-to-r from-pink-300 via-purple-500 to-indigo-400 text-white font-bold rounded-lg overflow-hidden transform transition-transform duration-500 hover:scale-110"
                                >
                                    <span>Logout</span>

                                    {/* Stars */}
                                    <div
                                        className="absolute w-[1px] h-[1px] bg-white rounded-full opacity-100 animate-blink"
                                        style={{ left: '120px', top: '18px' }}
                                    ></div>
                                    <div
                                        className="absolute w-[1px] h-[1px] bg-white rounded-full opacity-100 animate-blink delay-200"
                                        style={{ left: '167px', top: '48px' }}
                                    ></div>
                                    <div
                                        className="absolute w-[1px] h-[1px] bg-white rounded-full opacity-100 animate-blink delay-400"
                                        style={{ left: '239px', top: '20px' }}
                                    ></div>

                                    {/* Shooting stars */}
                                    <div
                                        className="absolute w-[80px] h-[1px] bg-gradient-to-r from-white to-transparent rounded-full opacity-0 animate-shooting-star-1"
                                        style={{ top: '-10px', left: '220px' }}
                                    ></div>
                                    <div
                                        className="absolute w-[80px] h-[1px] bg-gradient-to-r from-white to-transparent rounded-full opacity-0 animate-shooting-star-2"
                                        style={{ top: '-10px', left: '150px' }}
                                    ></div>
                                </button>
                            </div>
                        </div>

                    ) : (
                        <Link href="/sign-in">

                            <div className="w-[100px] h-[40px]">
                                <button
                                    id="space-btn"
                                    name="space-button"
                                    type="submit"
                                    className="relative w-full h-full bg-gradient-to-r from-pink-300 via-purple-500 to-indigo-400 text-white font-bold rounded-lg overflow-hidden transform transition-transform duration-500 hover:scale-110"
                                >
                                    <span>Join</span>

                                    {/* Stars */}
                                    <div
                                        className="absolute w-[1px] h-[1px] bg-white rounded-full opacity-100 animate-blink"
                                        style={{ left: '120px', top: '18px' }}
                                    ></div>
                                    <div
                                        className="absolute w-[1px] h-[1px] bg-white rounded-full opacity-100 animate-blink delay-200"
                                        style={{ left: '167px', top: '48px' }}
                                    ></div>
                                    <div
                                        className="absolute w-[1px] h-[1px] bg-white rounded-full opacity-100 animate-blink delay-400"
                                        style={{ left: '239px', top: '20px' }}
                                    ></div>

                                    {/* Shooting stars */}
                                    <div
                                        className="absolute w-[80px] h-[1px] bg-gradient-to-r from-white to-transparent rounded-full opacity-0 animate-shooting-star-1"
                                        style={{ top: '-10px', left: '220px' }}
                                    ></div>
                                    <div
                                        className="absolute w-[80px] h-[1px] bg-gradient-to-r from-white to-transparent rounded-full opacity-0 animate-shooting-star-2"
                                        style={{ top: '-10px', left: '150px' }}
                                    ></div>
                                </button>
                            </div>

                        </Link>
                    )}
                    </div>
                </div>
                <div className="absolute top-[-50%] left-[-50%] h-[200%] bg-[repeating-linear-gradient(45deg,_#ff0_0,_#ff0_10px,_#000_10px,_#000_20px)] opacity-10 animate-[stripe-animation_20s_linear_infinite]"></div>
            </div>
        </nav>
    )
}
export default Navbar