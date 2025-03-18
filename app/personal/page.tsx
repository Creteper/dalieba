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

export default function PersonalPage() {

    const [userName, setUserName] = useState("用户牛逼666")
    const [userEmail, setUserEmail] = useState("lijianlin050416@gmail.com")
    const [isLocal, setIsLocal] = useState(false)

    return (
        <div className="w-screen h-screen flex">
            <Button onClick={() => {
                setIsLocal(!isLocal)
            }} />
            <div className="mx-auto h-screen w-1/3 py-20 flex flex-col gap-5">
                <p className="text-3xl font-bold">个人中心</p>
                <div className="flex gap-5 items-center">
                    <Avatar className="w-24 h-fit">
                        <AvatarImage src="/img.jpg" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
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
                        {/* {itemContents.map((item, index) => (
                            <CardItem key={index} className="py-5 justify-between" hasBottom={true}>
                                <p>{item.content}</p>
                                <Button variant="outline" className="">{item.buttonContent}</Button>
                            </CardItem>
                        ))} */}
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
                        <CardItem className="py-5 justify-between" hasBottom={true}>
                            <p>管理历史回答记录</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="">
                                        清空记录
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex items-center justify-between">
                                    <p>确认清空记录？</p>
                                    <Button variant="destructive">确认</Button>
                                </PopoverContent>
                            </Popover>

                        </CardItem>
                        {isLocal ? null : <CardItem className="pt-5 justify-between">
                            <p>当前登录账号：{userEmail}</p>
                            <Button variant="destructive" className="">退出登录</Button>
                        </CardItem>}
                    </CardContent>
                </Card>
            </div>
        </div >
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
