"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import ArticleControlBar from "@/components/ui/articleControlBar";
import { useState } from "react";
import { motion } from "motion/react";
import WaterFall from "./waterFall";
import { Article } from "@/types/article";

export default function Community() {
    const [tag, setTag] = useState(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            switch (params.get("tag")) {
                case "goTravel":
                    return "一起旅行";
                case "goEat":
                    return "吃遍全国";
                case "anyTravel":
                    return "AnyTravel";
                default:
                    return "为您推荐";
            }
        }
        return "为您推荐"; // 服务端渲染时的默认值
    });

    const router = useRouter();

    // 文章列表
    const articles: Article[] = [
        {
            userName: "用户牛逼666",
            userAvatar: "/img.jpg",
            articleTitle: "一个好文章",
            articleImg: "/img.jpg",
            // articleImg: "https://sns-webpic-qc.xhscdn.com/202503251101/80e826d29580070add2c75ae6830506d/notes_pre_post/1040g3k831f80qmqn6e705o07tjogbhjcmff9pj8!nc_n_webp_mw_1",
            viewCounts: "1.5",
            likeCounts: "333",
            collectCounts: "666",
            shareCounts: "555",
            isLiked: false,
            isStarred: false,
            width: 374,
            height: 640
        }, {
            userName: "用户牛逼666",
            userAvatar: "/img.jpg",
            articleTitle: "一个好文章",
            // articleDescription: string;
            // articleClasses: string;
            articleImg: "/img.jpg",
            // articleImg: "https://sns-webpic-qc.xhscdn.com/202503251103/9e3835fd78ea2df0b6c6d141ecf7acba/1040g00831ehmbp7g10005nv788n09cornao3m0g!nc_n_webp_mw_1",
            viewCounts: "1.5",
            likeCounts: "333",
            collectCounts: "666",
            shareCounts: "555",
            isLiked: false,
            isStarred: false,
            width: 374,
            height: 374
        },
        {
            userName: "用户牛逼666",
            userAvatar: "/img.jpg",
            articleTitle: "一个好文章",
            // articleDescription: string;
            // articleClasses: string;
            articleImg: "/img.jpg",
            // articleImg: "https://sns-webpic-qc.xhscdn.com/202503251101/60c35386e02784ef3564c4e09ac85988/spectrum/1040g0k031fd62q8vn6005ptk7s622ripu250318!nc_n_webp_mw_1",
            viewCounts: "1.5",
            likeCounts: "333",
            collectCounts: "666",
            shareCounts: "555",
            isLiked: false,
            isStarred: false,
            width: 374,
            height: 374
        }, {
            userName: "用户牛逼666",
            userAvatar: "/img.jpg",
            articleTitle: "一个好文章",
            // articleDescription: string;
            // articleClasses: string;
            articleImg: "/img.jpg",
            // articleImg: "https://sns-webpic-qc.xhscdn.com/202503251101/8108d0579480740357f43cb3aa6e9d4a/1040g00831f28mg6mls005nm6guigbvul5lgghl8!nc_n_webp_mw_1",
            viewCounts: "1.5",
            likeCounts: "333",
            collectCounts: "666",
            shareCounts: "555",
            isLiked: false,
            isStarred: false,
            width: 640,
            height: 374
        },
        {
            userName: "用户牛逼666",
            userAvatar: "/img.jpg",
            articleTitle: "一个好文章",
            // articleDescription: string;
            // articleClasses: string;
            articleImg: "/img.jpg",
            // articleImg: "https://sns-webpic-qc.xhscdn.com/202503251103/6a2ab382d85dd89848193675ae9eeb50/1040g2sg31f6mqctema005o7aa9e0ao6epqbual0!nc_n_webp_mw_1",
            viewCounts: "1.5",
            likeCounts: "333",
            collectCounts: "666",
            shareCounts: "555",
            isLiked: false,
            isStarred: false,
            width: 374,
            height: 640
        },
        {
            userName: "用户牛逼666",
            userAvatar: "/img.jpg",
            articleTitle: "一个好文章",
            // articleDescription: string;
            // articleClasses: string;
            articleImg: "/img.jpg",
            // articleImg: "https://sns-webpic-qc.xhscdn.com/202503251103/850d2bd88c4625a4486d946499ab87d8/1040g2sg31fcm97mi6icg4bul3qudu69abpu770o!nc_n_webp_mw_1",
            viewCounts: "1.5",
            likeCounts: "333",
            collectCounts: "666",
            shareCounts: "555",
            isLiked: false,
            isStarred: false,
            width: 374,
            height: 640
        },
    ]

    return (
        <motion.div
            className="flex p-10 h-screen justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ArticleControlBar />
            <div className="h-full w-full md:w-4xl flex flex-col gap-5">
                <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => router.push("home")}>
                        <ChevronLeft />
                        返回主页
                    </Button>
                    <p className="text-3xl font-bold text-nowrap">「{tag}」</p>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex w-full items-center space-x-2 ml-auto">
                        <Input className="ml-3" type="text" placeholder="搜索帖子" />
                        <Button type="submit">搜索</Button>
                    </div>
                </div>
                <WaterFall articles={articles} />
            </div>
        </motion.div>
    );
}
