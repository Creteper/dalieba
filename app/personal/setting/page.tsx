"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, Drawer } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { useState } from "react";

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

export default function Setting() {

    const [userEmail, setUserEmail] = useState("lijianlin050416@gmail.com")

    return (
        <Card className="w-full">
            <CardContent>
                <CardItem className="pb-5 justify-between" hasBottom={true}>
                    <p>更改账号或密码</p>
                    <Button variant="outline" className="">点击更改</Button>
                </CardItem>
                <CardItem className="py-5 justify-between" hasBottom={true}>
                    <p>查看收藏路线</p>
                    <Button variant="outline" className="">查看收藏</Button>
                </CardItem>
                <CardItem className="justify-between py-5">
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
                <CardItem hasTop={true} className="pt-5 flex flex-col md:flex-row md:items-center md:justify-between items-start gap-5">
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
                                        <Button variant="outline" className="w-full">取消</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </CardItem>
            </CardContent>
        </Card>
    )
}
