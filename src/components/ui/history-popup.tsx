"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XOctagonIcon, LinkIcon, CopyIcon, Loader2 } from "lucide-react";

export default function HistoryPopup() {
    const [open, setOpen] = useState(false);
    const [copying, setCopying] = useState<number | null>(null);
    
    interface HistoryItem {
        url: string;
    }

    const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
        if (typeof window !== "undefined") {
            const storedHistory = localStorage.getItem("historyItems");
            return storedHistory ? JSON.parse(storedHistory) : [];
        }
        return [];
    });

    useEffect(() => {
        // Handler that supports both cross-document StorageEvent and our in-document CustomEvent
        const handleStorageChange = (event: Event) => {
            if (event instanceof StorageEvent) {
                if (event.key === "historyItems") {
                    setHistoryItems(event.newValue ? JSON.parse(event.newValue) : []);
                }
            } else if (event instanceof CustomEvent) {
                const detail = event.detail as { key?: string; newValue?: string } | undefined;
                if (detail?.key === "historyItems") {
                    setHistoryItems(detail.newValue ? JSON.parse(detail.newValue) : []);
                }
            }
        };

        // Listen for cross-document storage events
        window.addEventListener("storage", handleStorageChange);
        // Also listen for in-document updates (dispatched when we override setItem below)
        window.addEventListener("local-storage", handleStorageChange as EventListener);

        // Override localStorage.setItem / removeItem in this document to emit a CustomEvent
        const ls = window.localStorage;
        const originalSetItem = ls.setItem.bind(ls);
        const originalRemoveItem = ls.removeItem.bind(ls);

        (window.localStorage as any).setItem = (key: string, value: string) => {
            originalSetItem(key, value);
            window.dispatchEvent(
                new CustomEvent("local-storage", { detail: { key, newValue: value } })
            );
        };

        (window.localStorage as any).removeItem = (key: string) => {
            originalRemoveItem(key);
            window.dispatchEvent(new CustomEvent("local-storage", { detail: { key, newValue: null } }));
        };

        // Ensure we have the latest value on mount
        const updatedHistory = localStorage.getItem("historyItems");
        setHistoryItems(updatedHistory ? JSON.parse(updatedHistory) : []);

        return () => {
            // restore original functions and listeners
            (window.localStorage as any).setItem = originalSetItem;
            (window.localStorage as any).removeItem = originalRemoveItem;
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("local-storage", handleStorageChange as EventListener);
        };
    }, []);

    const handleCopy = async (url: string, idx: number) => {
        setCopying(idx);
        try {
            await navigator.clipboard.writeText(url);
            setTimeout(() => setCopying(null), 800);
        } catch {
            console.error("Failed to copy URL");
            setCopying(null);
        }
    };

    // stagger effect
    const listVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Pill Button */}
            {!open && (
                <motion.button
                    onClick={() => setOpen(true)}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="px-4 py-2 text-white bg-[#1f1f1f] hover:bg-[#2f2f2f] border border-white/10 rounded-full shadow-lg transition"
                >
                    History
                </motion.button>
            )}

            {/* Popup */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="popup"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed bottom-16 right-6 w-[88%] lg:w-[32%] h-[40%] text-white bg-[#1f1f1f] border border-white/10 shadow-2xl rounded-xl p-4 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold">History</h2>
                            <button onClick={() => setOpen(false)}>
                                <XOctagonIcon size={28} stroke="#fff" />
                            </button>
                        </div>

                        {/* Items with stagger */}
                        <motion.ul
                            className="space-y-2 overflow-y-auto no-scrollbar pr-1 flex-1"
                            variants={listVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {historyItems.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center">
                                    No history found or history expired
                                </p>
                            ) : (
                                historyItems.map((item, idx) => (
                                    <motion.li
                                        key={idx}
                                        variants={itemVariants}
                                        className="flex items-center justify-between p-2 bg-[#1f1f1f] border border-white/10 rounded hover:bg-[#2b2b2b]"
                                    >
                                        <span>{item.url}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => (window.location.href = item.url)}
                                                className="p-1 hover:text-[#fb3e16]"
                                            >
                                                <LinkIcon size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleCopy(item.url, idx)}
                                                className="p-1 hover:text-green-400"
                                            >
                                                {copying === idx ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    <CopyIcon size={20} />
                                                )}
                                            </button>
                                        </div>
                                    </motion.li>
                                ))
                            )}
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ✅ Hide scrollbars globally */}
            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}
