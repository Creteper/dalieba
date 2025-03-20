"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"

export default function PersonalPage() {

    const [userName, setUserName] = useState("用户牛逼666")
    const [userEmail, setUserEmail] = useState("lijianlin050416@gmail.com")
    const [isLocal, setIsLocal] = useState(false)

    const router = useRouter()

    var historyPadding = ""

    return (
        <div className="w-screen h-screen flex">
            <motion.div className="mx-auto h-screen w-9/12 sm:w-8/12 md:w-7/12 lg:w-5/12 xl:w-1/3 py-20 flex flex-col gap-5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-center">
                    <p className="text-3xl font-bold">个人中心</p>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/")}>返回主页</Button>
                </div>
                <div className="flex flex-col md:flex-row gap-5 items-center">
                    <Avatar className="w-24 h-fit">
                        <AvatarImage src="/img.jpg" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 items-center md:items-start">
                        <p className="text-2xl font-bold">{isLocal ? "未登录" : userName}</p>
                        <p className="text-muted-foreground">{userEmail}</p>
                    </div>
                    {isLocal ?
                        <Dialog>
                            <DialogTrigger asChild className="ml-auto">
                                <Button variant={"secondary"}>
                                    登陆
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription>
                                        输入账号与密码进行登录
                                    </DialogDescription>
                                </DialogHeader>
                                <Label htmlFor="account">账号</Label>
                                <Input id="account" />
                                <Label htmlFor="password">密码</Label>
                                <Input id="password" />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="ghost">取消</Button>
                                    </DialogClose>
                                    <Button>登陆</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        : null}
                </div>
                <Card className="mt-5">
                    <CardContent>
                        {isLocal ?
                            <div>
                                <CardItem className="pb-5" hasBottom={true}>
                                    <p>您当前尚未登录，数据只存储在本地，无法进行多端互通。</p>
                                </CardItem>
                            </div> : <div>
                            </div>}
                        {isLocal ? null : <CardItem className="pb-5 justify-between" hasBottom={true}>
                            <p>更改账号或密码</p>
                            <Button variant="outline" className="">点击更改</Button>
                        </CardItem>}
                        <CardItem className="py-5 justify-between" hasBottom={true}>
                            <p>查看收藏路线</p>
                            <Button variant="outline" className="">查看收藏</Button>
                        </CardItem>
                        {(() => {
                            historyPadding = isLocal ? "pt-5" : "py-5";
                            return null;
                        })()}
                        <CardItem className={"justify-between " + historyPadding}>
                            <p>管理历史回答记录</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="">
                                        清空记录
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-fit flex items-center gap-5">
                                    <p>确认清空记录？</p>
                                    <Button variant="destructive">确认</Button>
                                </PopoverContent>
                            </Popover>
                        </CardItem>
                        {isLocal ? null : <CardItem hasTop={true} className="pt-5 flex flex-col md:flex-row md:items-center md:justify-between items-start gap-5">
                            <div>
                                <p>当前登录账号：</p>
                                <p>{userEmail}</p>
                            </div>
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <Button variant="destructive" className="w-full md:w-fit">退出登录</Button>
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
                                            <Button>确认</Button>
                                            <DrawerClose asChild className="w-full">
                                                <Button variant="outline" className="w-full">Cancel</Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </div>
                                </DrawerContent>
                            </Drawer>

                        </CardItem>}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

type CardItemProps = React.ComponentProps<"div"> & {
    hasTop?: boolean;
    hasBottom?: boolean;
}

function CardItem({ className, hasTop = false, hasBottom = false, ...props }: CardItemProps) {
    return (
        <div>
            {hasTop ? <Separator /> : null}
            <div className={"flex items-center " + className} {...props} />
            {hasBottom ? <Separator /> : null}
        </div>
    )
}
