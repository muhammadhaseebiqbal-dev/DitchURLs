"use client"
import React, { useState } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";
import '@/app/globals.css'
import WrapButton from '@/components/ui/wrap-button';
import { AlertTriangle, Globe } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Toast from '@/components/ui/toast';
import { AnimatePresence } from 'motion/react';


function PasswordPage() {
    const [password, setPassword] = useState<string>("")
    const params = useParams();
    const short_code = params?.short_code as string;
    const [isToast, setIsToast] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [toastVariant, setToastVariant] = useState<string>('')
    const [toastMessage, setToastMessage] = useState<string>('')

    // Handlers
    const handlePasswordField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e?.target?.value)

    }

    const handleLetsDive = async () => {
        setIsLoading(true)

        try {
            axios.post(`/${short_code}/password/api`, { password })
                .then((response) => {
                    if (response.data.success) {
                        setIsLoading(false)
                        window.location.replace(`${response.data.actual_url}`);
                    }
                    else {
                        setIsLoading(false)
                        setIsToast(true)
                        setToastVariant("destructive")
                        setToastMessage(response.data.message)
                        setInterval(() => {
                            setIsToast(false)
                        }, 1500)

                    }
                })


        } catch (error) {
            setIsLoading(false)

            setIsToast(true)
            setToastVariant("destructive")
            setToastMessage("Unexpected error occurred")
            setInterval(() => {
                setIsToast(false)
            }, 1500)
        }
    }

    return (
        <div className="relative flex h-[100svh] w-full overflow-hidden bg-black/[0.96] antialiased md:items-center md:justify-center">
            <div
                className={cn(
                    "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
                    "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
                )}
            />

            <Spotlight
                className="-top-40 left-0 md:-top-20 md:left-50"
                fill="white"
            />
            <div className="flex justify-center flex-col items-center z-10 w-full h-screen max-w-7xl p-4 pt-20 md:pt-0">
                <div
                    className='relative -mt-30 lg:mt-0 flex flex-col gap-4 justify-center items-center password bg-[#151515] h-[25%] pt-10 p-5 lg:w-[30%] w-[95%] rounded-lg text-gray-400/70 outline-none border-1 border-white/10'
                >
                    <input type="password"
                        className='bg-[#151515] border-white/10 border-1 w-[90%] p-3'
                        name="password"
                        placeholder='password please'
                        value={password}
                        onChange={handlePasswordField}
                    />
                    <div className='flex gap-2 text-gray-500'>
                        <AlertTriangle />
                        <span><i>This link is password protected</i></span>
                    </div>
                </div>
                <WrapButton className="mt-10" onClick={handleLetsDive}>
                    <Globe className={isLoading ? 'animate-spin' : ''} />
                    Lets dive
                </WrapButton>
                <AnimatePresence>
                    {isToast && <Toast variant={toastVariant} message={toastMessage} />}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default PasswordPage;