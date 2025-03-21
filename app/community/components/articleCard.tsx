"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Heart, Star, Share } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ArticleCard({
    userName,
    userAvatar,
    articleTitle,
    articleDescription,
    articleClasses,
    articleImg,
    viewCounts,
    likeCounts,
    collectCounts,
    shareCounts
}: {
    userName: string
    userAvatar: string
    articleTitle: string
    articleDescription: string
    articleClasses: string
    articleImg: string
    viewCounts: string
    likeCounts: string
    collectCounts: string
    shareCounts: string
}) {
    const isMobile = useIsMobile()
    return (
        <>
            {
                isMobile ? (
                    <Card className="shadow-none w-full rounded-none border-0 border-b">
                        <CardContent className="max-h-72 flex flex-col justify-between">
                            <CardTitle className="flex gap-2 items-center">
                                <Avatar className="w-10 h-fit">
                                    <AvatarImage src={userAvatar} />
                                    < AvatarFallback > CN</AvatarFallback >
                                </Avatar >
                                <div className="flex flex-col items-start gap-1">
                                    <div className="flex gap-3 items-center">
                                        <p className="font-bold line-clamp-2">{articleTitle}</p>
                                        <Badge>{articleClasses}</Badge>
                                    </div>
                                    <p className="text-muted-foreground text-sm">@{userName}</p>
                                </div>
                            </CardTitle >
                            <div className="w-full h-5/12">
                                <img
                                    src={articleImg}
                                    alt=""
                                    className="h-full w-full object-cover rounded-md"
                                />
                            </div>
                            <div className="text-md indent-4 max-w-full overflow-hidden line-clamp-2">
                                {articleDescription}
                            </div>
                            <div className="text-sm text-muted-foreground flex justify-end gap-5">
                                <div className="flex mr-auto gap-1 items-center">
                                    <Eye />
                                    {viewCounts}
                                </div>
                                <div className="flex gap-1 items-center">
                                    <Heart />
                                    {likeCounts}
                                </div>
                                <div className="flex gap-1 items-center">
                                    <Star />
                                    {collectCounts}
                                </div>
                                <div className="flex gap-1 items-center">
                                    <Share />
                                    {shareCounts}
                                </div>
                            </div>
                        </CardContent >
                    </Card>
                ) : (
                    <Card className="shadow-none w-full rounded-none border-0 border-b" >
                        <CardContent className="flex gap-10">
                            <div className="flex flex-col w-full justify-between">
                                <CardTitle className="flex gap-2 items-center">
                                    <Avatar className="w-10 h-fit">
                                        <AvatarImage src={userAvatar} />
                                        < AvatarFallback > CN</AvatarFallback >
                                    </Avatar >
                                    <div className="flex flex-col items-start gap-1">
                                        <div className="flex gap-3 items-center">
                                            <p className="font-bold line-clamp-2">{articleTitle}</p>
                                            <Badge>{articleClasses}</Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm">@{userName}</p>
                                    </div>
                                </CardTitle >

                                <div className="text-md indent-4 max-w-full overflow-hidden line-clamp-2">
                                    {articleDescription}
                                </div>

                                <div className="text-sm text-muted-foreground flex gap-5">
                                    <div className="flex mr-auto gap-1 items-center">
                                        <Eye />
                                        {viewCounts}
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <Heart />
                                        {likeCounts}
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <Star />
                                        {collectCounts}
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <Share />
                                        {shareCounts}
                                    </div>
                                </div>
                            </div >
                            <div className="h-full aspect-[16/9]">
                                <img
                                    src={articleImg}
                                    alt=""
                                    className="h-full w-full object-cover rounded-md"
                                />
                            </div>
                        </CardContent >
                    </Card>
                )
            }
        </>
    )
}