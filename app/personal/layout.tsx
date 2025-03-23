"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "motion/react"

export default function PersonalLayout({ children }: { children: React.ReactNode }) {

    const [userName, setUserName] = useState("用户牛逼666")
    const [userEmail, setUserEmail] = useState("lijianlin050416@gmail.com")

    const router = useRouter()

    return (
        <div className="max-w-screen h-screen flex">
            <motion.div className="mx-auto items-center w-9/12 sm:w-8/12 md:w-7/12 lg:w-5/12 xl:w-1/3 py-20 flex flex-col gap-5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full flex justify-between items-center">
                    <p className="text-3xl font-bold">个人中心</p>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/")}>返回主页</Button>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-5 items-center">
                    <Avatar className="w-24 h-fit">
                        <AvatarImage src="/img.jpg" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 items-center md:items-start">
                        <p className="text-2xl font-bold">{userName}</p>
                        <p className="text-muted-foreground">{userEmail}</p>
                    </div>
                </div>

                <div className="w-full flex flex-col">
                    <div className="flex justify-evenly">
                        <SelectionButton selection="作品" url="/personal/myposts"></SelectionButton>
                        <SelectionButton selection="点赞" url="/personal/likes"></SelectionButton>
                        <SelectionButton selection="收藏" url="/personal/stars"></SelectionButton>
                        <SelectionButton selection="设置" url="/personal/setting"></SelectionButton>
                    </div>
                </div>

                {children}
            </motion.div>
        </div >
    )
}

function SelectionButton({ selection, url }: { selection: string, url: string }) {

    const router = useRouter()

    const onClick = (url: string) => {
        router.push(url)
    }

    const pathname = usePathname()
    const isActive = pathname === url

    return (
        <Button
            variant="link"
            className={`text-md shadow-none ${isActive ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => onClick(url)}
        >
            {selection}
        </Button>
    )
}
