/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-03-25 12:01:47
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-08 15:29:02
 * @FilePath: \dalieba\app\personal\layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import ControlBar from "@/components/ui/control-bar";
import { UserInfoResponse } from "@/types/article";
import UserClient from "@/lib/use-client";
import { toast } from "sonner";

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userClient = new UserClient();

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const data = await userClient.getUserInfo<UserInfoResponse>();
        if (data) {
          setUserName(data.username);
          setUserEmail(data.email);
        }
      } catch (error) {
        console.error("获取用户信息失败", error);
        toast.error("获取用户信息失败");
      }
    }

    fetchUserInfo();
  }, []);

  const [userName, setUserName] = useState("用户");
  const [userEmail, setUserEmail] = useState("用户邮箱");
  const pathname = usePathname();

  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* 顶部导航栏 */}
      <div className="px-20 flex items-center h-32">
        <h1 className="text-3xl font-bold">个人中心</h1>
        <div className="ml-auto flex gap-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              className="mr-4"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-5 w-5" />
              返回主页
            </Button>
          </motion.div>
          <ControlBar className="static!" variant="outline" />
        </div>
      </div>

      {/* 个人信息区域 */}
      <div className="w-full px-20 py-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <Avatar className="w-32 h-32 md:w-24 md:h-24 border-2 border-background shadow-lg">
            <AvatarImage src="/img.jpg" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <p className="text-xl md:text-2xl font-bold">{userName}</p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* 标签导航区域 */}
      <div className=" border-b mx-20">
        <div className="w-full px-4">
          <div className="flex">
            <SelectionButton
              selection="收藏"
              url="/personal/stars"
            ></SelectionButton>
            <SelectionButton
              selection="设置"
              url="/personal/setting"
            ></SelectionButton>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="w-full px-20 py-6 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SelectionButton({
  selection,
  url,
}: {
  selection: string;
  url: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === url || pathname.startsWith(`${url}/`);

  return (
    <div className="relative flex flex-col items-center mr-8">
      <Button
        variant="ghost"
        className={`text-md shadow-none px-2 py-4 hover:bg-transparent! rounded-none ${
          isActive
            ? "text-foreground font-bold"
            : "text-muted-foreground font-normal"
        } transition-all duration-300`}
        onClick={() => router.push(url)}
      >
        {selection}
      </Button>
      <div className="absolute bottom-0 w-full h-0.5">
        {isActive && (
          <motion.div
            className="w-full h-full bg-foreground"
            layoutId="activeTab"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
        )}
      </div>
    </div>
  );
}
