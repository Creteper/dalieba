/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-22 13:16:50
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-25 12:01:18
 * @FilePath: \dalieba\app\home\page.tsx
 * @Description: 用于显示首页内容
 */

"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import MapComponent from "@/components/map/MapComponent";
import ControlBar from "@/components/ui/control-bar";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Map, Flame, ChevronsRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import AnyTravel from "@/components/home/anyTravel/anyTravel";
import AnyTravelContent from "@/components/home/anyTravel/anyTravel";
import HotContent from "@/components/home/hot/hot";
import SearchBox from "@/components/home/search/search";
export default function HomePage() {
    const [helloTitle, setHelloTitle] = useState("");
    const isMobile = useIsMobile();
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState("hot"); // 默认选中hot

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/home/${tab}`);
    };

    useEffect(() => {
        // 从路径中提取当前标签
        const tab = pathname.split("/").pop();
        if (tab && ["hot", "anyTravel"].includes(tab)) {
            setActiveTab(tab);
        }
        setHelloTitle(getTimeState() + "，为您推荐");
    }, [pathname]);

    return (
        <div className="w-full">
            <div className="w-full h-screen">
                {/* <MapComponent
          showZoomLevel={false}
          className="w-full h-screen"
          center={[45.774835, 126.617682]}
        /> */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-[300px] h-[170px] absolute top-[70px] left-[10px] z-40"
                ></motion.div>
            </div>
            <motion.div
                className="w-full h-[60px] fixed bg-background/90 top-0 z-50 backdrop-blur-xl border-b-1 border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <nav className="w-full h-full flex items-center">
                    <div className="flex items-center justify-center gap-2 ml-4">
                        <img
                            src="/images/logo.svg"
                            className="w-8 h-8 object-cover"
                            alt="GO! TOGETHER"
                        />
                        <p className="font-bold text-xl">GO! TOGETHER</p>
                    </div>

                    <SearchBox className="ml-auto w-" />
                    <ControlBar variant="outline" className="static ml-auto mr-4" />
                </nav>
            </motion.div>
            <motion.div
                className={cn(
                    "w-full top-[40px] absolute bg-background rounded-t-xl z-40"
                )}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="w-full h-full">
                    <div className="px-10 md:px-20 pb-10">
                        <div className="bg-muted rounded-md w-full h-[150px] mt-20">
                            <div className="h-full px-6 py-6 flex flex-col gap-4">
                                <div>
                                    <h1 className="text-sm">不会做攻略？</h1>
                                    <p className="text-xl">
                                        试试 <span className="text-orange-500 font-bold">AI</span>{" "}
                                        旅行规划
                                    </p>
                                </div>
                                <div>
                                    <Button>
                                        去试试 <ChevronsRight />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <p className="font-bold mt-10 md:mt-12 text-md text-muted-foreground">
                            <Typewriter words={[helloTitle]} />
                        </p>

                        {/* 分类导航 */}
                        <div className="flex items-center gap-6 mt-6 mb-8 text-sm">
                            <Button
                                variant={activeTab === "hot" ? "default" : "ghost"}
                                onClick={() => handleTabChange("hot")}
                                className="gap-2"
                            >
                                <Flame className={cn("h-4 w-4")} />
                                推荐
                            </Button>
                            <Button
                                variant={activeTab === "anyTravel" ? "default" : "ghost"}
                                onClick={() => handleTabChange("anyTravel")}
                                className="gap-2"
                            >
                                <Map className={cn("h-4 w-4")} />
                                Any Travel
                            </Button>
                        </div>

                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "hot" ? <HotContent /> : <AnyTravelContent />}
                        </motion.div>

                        <p className="text-center text-muted-foreground pt-10 text-sm">
                            你以为我没有底线么？
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export function getTimeState() {
    let timeNow = new Date();
    let hours = timeNow.getHours();
    let state = "";

    if (hours >= 0 && hours <= 10) {
        state = "早上好";
    } else if (hours > 10 && hours >= 14) {
        state = "中午好";
    } else if (hours > 14 && hours <= 18) {
        state = "下午好";
    } else if (hours > 18 && hours <= 24) {
        state = "晚上好";
    } else {
        state = "晚上好";
    }
    return state;
}
