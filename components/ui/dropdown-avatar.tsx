/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-18 18:04:57
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-10 15:13:17
 * @FilePath: \dalieba\components\uiodropdawn-avatar.tsx
 * @Description: 用户下拉菜单
 */

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { User, LogOut, Sprout, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import UserClient from "@/lib/use-client";
import { UserInfoResponse } from "@/types/article";
export default function DropdownAvatar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const userClient = new UserClient();
  const [userInfo, setUserInfo] = React.useState<UserInfoResponse | null>(null);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const data = await userClient.getUserInfo<UserInfoResponse>();
        setUserInfo(data);
        console.log("用户信息获取成功:", data);
      } catch (error) {}
    }

    fetchUserInfo();
  }, []);

  return (
    <>
      {userInfo ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar
              className={cn(
                className,
                "hover:scale-105 transition-all select-none rounded-md!"
              )}
            >
              <AvatarImage src="/img.jpg" />
              <AvatarFallback
                className="rounded-md! text-sm"
              >{userInfo?.username.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 ml-2 space-y-2">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <Avatar
                  className={cn(
                    className,
                    "hover:scale-105 transition-all select-none"
                  )}
                >
                  <AvatarImage src="/img.jpg" />
                  <AvatarFallback>
                    {userInfo?.username.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h3>{userInfo?.username}</h3>
                  <p>{userInfo?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>
              <p className="text-[12px] text-muted-foreground">关于个人</p>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push("/personal")}>
              <User className="h-4 w-4" />
              个人中心
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                userClient.LogOut();
                router.push("/login");
              }}
              className="bg-destructive text-white hover:bg-destructive/80! hover:text-white! transition-all"
            >
              <LogOut className="h-4 w-4 text-destructive-foreground" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar
              className={cn(
                className,
                "hover:scale-105 transition-all select-none rounded-md!"
              )}
              onClick={() => router.push("/login")}
            >
              <AvatarImage src="/" />
              <AvatarFallback
                className="rounded-md! text-sm"
              >
                登录
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
        </DropdownMenu>
      )}
    </>
  );
}
