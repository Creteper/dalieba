"use client"

import { RotateCw, ArrowUpToLine } from "lucide-react";
import { motion } from "motion/react";

export default function ArticleControlBar({ showRefresh = true, showTop = true }: { showRefresh?: boolean, showTop?: boolean }) {
    return (
        <div className="fixed bottom-15 right-10 flex flex-col gap-3 z-999">
            {showRefresh && <div
                className="bg-foreground text-background rounded-md w-13 h-13 flex items-center justify-center">
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <RotateCw />
                </motion.div>
            </div>
            }

            {showTop && <div
                onClick={() => window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                })}
                className="bg-foreground text-background rounded-md w-13 h-13 flex items-center justify-center">
                <ArrowUpToLine />
            </div>}
        </div>
    )
}