/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-18 18:04:57
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-19 16:12:59
 * @FilePath: \dalieba\components\uiodropdawn-avatarrrrrrrrr.tsx
 * @Description: 用户下拉菜单   
 */


'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import * as React from "react"
import { cn } from "@/lib/utils"
import { User, LogOut, Sprout } from "lucide-react"
import { useRouter } from "next/navigation"
import UsersFunc from "@/lib/users-func"
import { useIsMobile } from "@/hooks/use-mobile"
export default function DropdownAvatar({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const isMobile = useIsMobile()

    return (
        <>
            {isMobile ? (
                <Avatar onClick={() => router.push("personal")} className={cn(className, "hover:scale-105 transition-all select-none")}>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className={cn(className, "hover:scale-105 transition-all select-none")}>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mt-2 ml-2 space-y-2">
                        <DropdownMenuItem onClick={() => router.push("/personal")}>
                            <User className="h-4 w-4" />
                            个人中心
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Sprout className="h-4 w-4" />
                            Together Go! (社区)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => UsersFunc.LogOut()} className="bg-destructive text-white hover:bg-destructive/80! hover:text-white! transition-all">
                            <LogOut className="h-4 w-4 text-destructive-foreground" />
                            退出
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu >
            )}
        </>
    )
}
