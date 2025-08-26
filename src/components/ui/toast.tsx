import React from "react"
import { motion } from "motion/react"

interface ToastProps {
    variant: string,
    message: string,
}

const Toast: React.FC<ToastProps> = ({
    variant,
    message
}) => {
    return (
            <motion.div
                key= {'toast'}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -20, opacity: 1 }}
                exit={{ y: 0, opacity: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                }}
                className={`absolute ${variant == 'destructive' ? 'bg-red-700' : 'bg-green-700'} px-6 py-4 rounded-full font-2xl text-white font-bold bottom-18`}
            >
                {message}
            </motion.div>
    )
}

export default Toast