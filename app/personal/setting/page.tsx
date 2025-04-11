"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import UpdatePwd from "./components/updatePwd";
import UserClient from "@/lib/use-client";
import { UserInfoResponse } from "@/types/article";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
type CardItemProps = React.ComponentProps<"div"> & {
  hasTop?: boolean;
  hasBottom?: boolean;
};

function CardItem({
  className,
  hasTop = false,
  hasBottom = false,
  ...props
}: CardItemProps) {
  return (
    <div>
      {hasTop ? <Separator /> : null}
      <div className={"flex items-center " + className} {...props} />
      {hasBottom ? <Separator /> : null}
    </div>
  );
}

export default function Setting() {
  const [userEmail, setUserEmail] = useState("lijianlin050416@gmail.com");
  const [pwdMode, setPwdMode] = useState("update");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const userClient = new UserClient()
  const router = useRouter()
  // 只在客户端挂载后渲染主题切换按钮
  useEffect(() => {
    setMounted(true);

    async function getUserInfo() {
      try {
        const userInfo = await userClient.getUserInfo<UserInfoResponse>()
        setUserEmail(userInfo.email)
      } catch (error: any) {
        toast.error("获取用户信息失败,", error.message)
        router.push("/login")
      }
    }
    getUserInfo()
    }, []);

  const handleLogout = async () => {
    try {
      await userClient.LogOut<UserInfoResponse>()
      toast.success("退出登录成功")
      router.push("/login")
    } catch (error: any) {
      toast.error("退出登录失败,", error.message)
    }
  }

  return (
    <Card className="w-full">
      <CardContent>
        <CardItem className="pb-5 justify-between" hasBottom={true}>
          <p>忘记&更新密码</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">点击更改</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <p>更新您的密码</p>
                </AlertDialogTitle>
              </AlertDialogHeader>
              <UpdatePwd />
            </AlertDialogContent>
          </AlertDialog>
        </CardItem>

        <CardItem className="py-5 justify-between" hasBottom={true}>
          <p>主题设置</p>
          {mounted && (
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="icon"
                onClick={() => setTheme("light")}
                title="浅色模式"
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="icon"
                onClick={() => setTheme("dark")}
                title="深色模式"
              >
                <Moon className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="icon"
                onClick={() => setTheme("system")}
                title="跟随系统"
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardItem>

        {/* <CardItem className="py-5 justify-between" hasBottom={true}>
          <p>查看历史 AI 攻略</p>
          <Button variant="outline" className="">
            查看收藏
          </Button>
        </CardItem>
        <CardItem className="justify-between py-5">
          <p>管理历史回答记录</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="">
                清空记录
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <p>确认清空记录？</p>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  清空后您当前的历史记录将无法找回，请您确认此操作
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction>确认</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardItem> */}
        <CardItem
          hasTop={true}
          className="pt-5 flex flex-col md:flex-row md:items-center md:justify-between items-start gap-5"
        >
          <div>
            <p>当前登录账号：</p>
            <p>{userEmail}</p>
          </div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="destructive" className="w-full md:w-fit">
                退出登录
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="flex flex-col  w-9/12 sm:w-8/12 md:w-7/12 lg:w-5/12 xl:w-1/3 mx-auto">
                <DrawerHeader>
                  <DrawerTitle>确认退出登录吗？</DrawerTitle>
                  <DrawerDescription>
                    退出登录后，您的历史路线问答与您收藏的路线将不能够在多端同步，只能在本地查看。
                    请确认您是否要退出登录
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="flex flex-col">
                  <Button onClick={handleLogout}>确认</Button>
                  <DrawerClose asChild className="w-full">
                    <Button variant="outline" className="w-full">
                      取消
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </CardItem>
      </CardContent>
    </Card>
  );
}
