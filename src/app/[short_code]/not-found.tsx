import React from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";
import { Lato } from "next/font/google";
import { AlertOctagon } from 'lucide-react';

const lato = Lato({
    variable: "--font-lato",
    subsets: ["latin"],
    weight: ["400", "700"],
});


function NotFound() {
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
            <div className=" flex justify-center flex-col items-center z-10 w-full max-w-7xl p-4 pt-20 md:pt-0">
                <h1 className='text-gray-400 text-2xl -mt-26 lg:-mt-4 flex items-center justify-center gap-4'>
                    <AlertOctagon />
                    <span>| &nbsp; Link not found!</span>
                </h1>
            </div>
        </div>
    )
}

export default NotFound;