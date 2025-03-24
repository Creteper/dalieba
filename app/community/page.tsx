"use client"

import { motion } from "motion/react";
import ArticleCard from "../../components/ui/articleCard";
import { ArrowUpToLine, ChevronLeft, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ArticleControlBar from "@/components/ui/articleControlBar";

export default function Community() {
    const router = useRouter()
    const isMobile = useIsMobile()

    const [articleClasses, setArticleClasses] = useState("推荐")

    return (
        <div className="flex p-10 h-screen justify-center">
            <ArticleControlBar />

            <div className="h-full w-full md:w-2xl flex flex-col gap-5">
                <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => router.push("home")}>
                        <ChevronLeft />
                        返回主页
                    </Button>

                    <p className="text-3xl font-bold text-nowrap">
                        赛博青楼
                    </p>

                </div>

                {isMobile ? (
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <Input type="text" placeholder="搜索帖子" />
                            <Button size="sm" type="submit">搜索</Button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <p className="text-lg">为您推荐</p>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline">
                                            当前分类：{articleClasses}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="bottom">
                                        <SheetHeader>
                                            <SheetTitle>选择您想看的分类</SheetTitle>
                                        </SheetHeader>

                                        <div className="px-5">
                                            <Accordion type="single" collapsible>
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger>吃</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Button variant="ghost" className="w-full">
                                                            吃吃吃吃吃1
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            吃吃吃吃吃2
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            吃吃吃吃吃3
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            吃吃吃吃吃4
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            吃吃吃吃吃5
                                                        </Button>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-2">
                                                    <AccordionTrigger>喝</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Button variant="ghost" className="w-full">
                                                            喝喝喝喝喝1
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            喝喝喝喝喝2
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            喝喝喝喝喝3
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            喝喝喝喝喝4
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            喝喝喝喝喝5
                                                        </Button>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-3">
                                                    <AccordionTrigger>玩</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Button variant="ghost" className="w-full">
                                                            玩玩玩玩玩1
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            玩玩玩玩玩2
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            玩玩玩玩玩3
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            玩玩玩玩玩4
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            玩玩玩玩玩5
                                                        </Button>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-4">
                                                    <AccordionTrigger>乐</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Button variant="ghost" className="w-full">
                                                            乐乐乐乐乐1
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            乐乐乐乐乐2
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            乐乐乐乐乐3
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            乐乐乐乐乐4
                                                        </Button>
                                                        <Button variant="ghost" className="w-full">
                                                            乐乐乐乐乐5
                                                        </Button>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>

                                        </div>

                                    </SheetContent>
                                </Sheet>
                            </div>
                            <Separator />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        <div className="flex w-full items-center space-x-2 ml-auto">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline">
                                        当前分类：{articleClasses}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <SheetHeader>
                                        <SheetTitle>选择您想看的分类</SheetTitle>
                                    </SheetHeader>

                                    <div className="px-5">
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>吃</AccordionTrigger>
                                                <AccordionContent>
                                                    <Button variant="ghost" className="w-full">
                                                        吃吃吃吃吃1
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        吃吃吃吃吃2
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        吃吃吃吃吃3
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        吃吃吃吃吃4
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        吃吃吃吃吃5
                                                    </Button>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-2">
                                                <AccordionTrigger>喝</AccordionTrigger>
                                                <AccordionContent>
                                                    <Button variant="ghost" className="w-full">
                                                        喝喝喝喝喝1
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        喝喝喝喝喝2
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        喝喝喝喝喝3
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        喝喝喝喝喝4
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        喝喝喝喝喝5
                                                    </Button>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-3">
                                                <AccordionTrigger>玩</AccordionTrigger>
                                                <AccordionContent>
                                                    <Button variant="ghost" className="w-full">
                                                        玩玩玩玩玩1
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        玩玩玩玩玩2
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        玩玩玩玩玩3
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        玩玩玩玩玩4
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        玩玩玩玩玩5
                                                    </Button>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-4">
                                                <AccordionTrigger>乐</AccordionTrigger>
                                                <AccordionContent>
                                                    <Button variant="ghost" className="w-full">
                                                        乐乐乐乐乐1
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        乐乐乐乐乐2
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        乐乐乐乐乐3
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        乐乐乐乐乐4
                                                    </Button>
                                                    <Button variant="ghost" className="w-full">
                                                        乐乐乐乐乐5
                                                    </Button>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                    </div>

                                </SheetContent>
                            </Sheet>
                            <Input className="ml-3" type="text" placeholder="搜索帖子" />
                            <Button type="submit">搜索</Button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-lg">为您推荐</p>
                            <Separator />
                        </div>
                    </div>
                )
                }

                {/* <div className="flex items-center">
                    <div className="flex w-full items-center space-x-2 ml-auto">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">
                                    当前分类：{articleClasses}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>选择您想看的分类</SheetTitle>
                                </SheetHeader>

                                <div className="px-5">
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger>吃</AccordionTrigger>
                                            <AccordionContent>
                                                <Button variant="ghost" className="w-full">
                                                    吃吃吃吃吃1
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    吃吃吃吃吃2
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    吃吃吃吃吃3
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    吃吃吃吃吃4
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    吃吃吃吃吃5
                                                </Button>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger>喝</AccordionTrigger>
                                            <AccordionContent>
                                                <Button variant="ghost" className="w-full">
                                                    喝喝喝喝喝1
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    喝喝喝喝喝2
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    喝喝喝喝喝3
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    喝喝喝喝喝4
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    喝喝喝喝喝5
                                                </Button>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-3">
                                            <AccordionTrigger>玩</AccordionTrigger>
                                            <AccordionContent>
                                                <Button variant="ghost" className="w-full">
                                                    玩玩玩玩玩1
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    玩玩玩玩玩2
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    玩玩玩玩玩3
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    玩玩玩玩玩4
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    玩玩玩玩玩5
                                                </Button>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-4">
                                            <AccordionTrigger>乐</AccordionTrigger>
                                            <AccordionContent>
                                                <Button variant="ghost" className="w-full">
                                                    乐乐乐乐乐1
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    乐乐乐乐乐2
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    乐乐乐乐乐3
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    乐乐乐乐乐4
                                                </Button>
                                                <Button variant="ghost" className="w-full">
                                                    乐乐乐乐乐5
                                                </Button>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>

                                </div>

                            </SheetContent>
                        </Sheet>
                        <Input className="ml-5" type="text" placeholder="搜索帖子" />
                        <Button type="submit">搜索</Button>
                    </div>
                </div> */}

                <div className="flex flex-col gap-3">
                    {/* <div className="flex flex-col gap-3">
                        <p className="text-lg">为您推荐</p>
                        <Separator />
                    </div> */}
                    <ArticleCard
                        userName="牛逼666"
                        userAvatar="/img.jpg"
                        articleTitle="一个特别有含金量的帖子"
                        articleDescription="这是一个真的非常有水平的帖子，看了后就如同醍醐灌顶一般，对旅行会有一个全新的认知，不知道你信不信，反正打开看的人都暴富了"
                        articleClasses="旅行干货"
                        articleImg="/img.jpg"
                        viewCounts="1.5k"
                        likeCounts="348"
                        collectCounts="52"
                        shareCounts="3.2k"
                    />
                    <ArticleCard
                        userName="牛逼666"
                        userAvatar="/img.jpg"
                        articleTitle="一个特别有含金量的帖子"
                        articleDescription="这是一个真的非常有水平的帖子，看了后就如同醍醐灌顶一般，对旅行会有一个全新的认知，不知道你信不信，反正打开看的人都暴富了"
                        articleClasses="旅行干货"
                        articleImg="/img.jpg"
                        viewCounts="1.5k"
                        likeCounts="348"
                        collectCounts="52"
                        shareCounts="3.2k"
                    />
                    <ArticleCard
                        userName="牛逼666"
                        userAvatar="/img.jpg"
                        articleTitle="一个特别有含金量的帖子"
                        articleDescription="这是一个真的非常有水平的帖子，看了后就如同醍醐灌顶一般，对旅行会有一个全新的认知，不知道你信不信，反正打开看的人都暴富了"
                        articleClasses="旅行干货"
                        articleImg="/img.jpg"
                        viewCounts="1.5k"
                        likeCounts="348"
                        collectCounts="52"
                        shareCounts="3.2k"
                    />
                    <ArticleCard
                        userName="牛逼666"
                        userAvatar="/img.jpg"
                        articleTitle="一个特别有含金量的帖子"
                        articleDescription="这是一个真的非常有水平的帖子，看了后就如同醍醐灌顶一般，对旅行会有一个全新的认知，不知道你信不信，反正打开看的人都暴富了"
                        articleClasses="旅行干货"
                        articleImg="/img.jpg"
                        viewCounts="1.5k"
                        likeCounts="348"
                        collectCounts="52"
                        shareCounts="3.2k"
                    />
                    <ArticleCard
                        userName="牛逼666"
                        userAvatar="/img.jpg"
                        articleTitle="一个特别有含金量的帖子"
                        articleDescription="这是一个真的非常有水平的帖子，看了后就如同醍醐灌顶一般，对旅行会有一个全新的认知，不知道你信不信，反正打开看的人都暴富了"
                        articleClasses="旅行干货"
                        articleImg="/img.jpg"
                        viewCounts="1.5k"
                        likeCounts="348"
                        collectCounts="52"
                        shareCounts="3.2k"
                    />
                    <ArticleCard
                        userName="牛逼666"
                        userAvatar="/img.jpg"
                        articleTitle="一个特别有含金量的帖子"
                        articleDescription="这是一个真的非常有水平的帖子，看了后就如同醍醐灌顶一般，对旅行会有一个全新的认知，不知道你信不信，反正打开看的人都暴富了"
                        articleClasses="旅行干货"
                        articleImg="/img.jpg"
                        viewCounts="1.5k"
                        likeCounts="348"
                        collectCounts="52"
                        shareCounts="3.2k"
                    />
                    <ArticleCard
                        userName="牛逼666"
                        userAvatar="/img.jpg"
                        articleTitle="一个特别有含金量的帖子"
                        articleDescription="这是一个真的非常有水平的帖子，看了后就如同醍醐灌顶一般，对旅行会有一个全新的认知，不知道你信不信，反正打开看的人都暴富了"
                        articleClasses="旅行干货"
                        articleImg="/img.jpg"
                        viewCounts="1.5k"
                        likeCounts="348"
                        collectCounts="52"
                        shareCounts="3.2k"
                    />
                    <ArticleCard
                        userName="牛逼666"
                        userAvatar="/img.jpg"
                        articleTitle="一个特别有含金量的帖子"
                        articleDescription="这是一个真的非常有水平的帖子，看了后就如同醍醐灌顶一般，对旅行会有一个全新的认知，不知道你信不信，反正打开看的人都暴富了"
                        articleClasses="旅行干货"
                        articleImg="/img.jpg"
                        viewCounts="1.5k"
                        likeCounts="348"
                        collectCounts="52"
                        shareCounts="3.2k"
                    />
                    <ArticleCard
                        userName="牛逼666"
                        userAvatar="/img.jpg"
                        articleTitle="一个特别有含金量的帖子"
                        articleDescription="这是一个真的非常有水平的帖子，看了后就如同醍醐灌顶一般，对旅行会有一个全新的认知，不知道你信不信，反正打开看的人都暴富了"
                        articleClasses="旅行干货"
                        articleImg="/img.jpg"
                        viewCounts="1.5k"
                        likeCounts="348"
                        collectCounts="52"
                        shareCounts="3.2k"
                    />
                </div>
            </div>
        </div>
    )
}