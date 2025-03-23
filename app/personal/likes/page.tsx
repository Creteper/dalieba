"use client"

import ArticleCard from "@/components/ui/articleCard";
import ArticleControlBar from "@/components/ui/articleControlBar";

export default function Likes() {
    return (
        <div className="h-full w-full md:w-2xl flex flex-col gap-5">
            <ArticleControlBar showRefresh={false} />
            <ArticleCard
                isLiked={true}
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
                isLiked={true}
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
    )
}