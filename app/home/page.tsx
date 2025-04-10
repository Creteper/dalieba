/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-22 13:16:50
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-08 14:52:06
 * @FilePath: \dalieba\app\home\page.tsx
 * @Description: 用于显示首页内容
 */

"use client";

import { useEffect, useState } from "react";
import * as React from "react";
import ControlBar from "@/components/ui/control-bar";
import { Typewriter } from "react-simple-typewriter";
import MapComponent from "@/components/map/MapComponent";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Map, Flame, ChevronsRight, Camera, Navigation } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import SearchBox from "@/components/home/search/search";
import { useIsMobile } from "@/hooks/use-mobile";
import UserClient from "@/lib/use-client";
import { UserInfoResponse } from "@/types/article";
import SpotCard from "@/components/home/componentsHome/spot-card";

export default function HomePage() {
  const [helloTitle, setHelloTitle] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const userClient = new UserClient();
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  useEffect(() => {
    // async function checkedToken() {
    //   const isValid = await userClient.verifyToken();
    //   console.log(isValid);
    //   if (!isValid) {
    //     router.push("/login");
    //   }
    // }
    // checkedToken();
    setHelloTitle(getTimeState() + "，最新旅行资讯");
  }, [pathname]);

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 固定导航栏 */}
      <motion.div
        className="w-full h-[60px] fixed bg-background top-0 z-50 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="w-full h-full flex items-center">
          <div className="flex items-center justify-center gap-2 ml-4">
            {/* <img
              src="/images/logo.svg"
              className="w-8 h-8 object-cover"
              alt="GO! TOGETHER"
            /> */}
            {isMobile ? null : (
              <p className="font-bold text-xl">GO! TOGETHER</p>
            )}
          </div>
          <SearchBox className="ml-auto" />
          <ControlBar variant="outline" className="static ml-auto mr-4" />
        </nav>
      </motion.div>

      {/* 主内容区域 */}
      <div className="pt-[60px] w-full">
        <div className="w-full px-4 md:px-20 py-4">
          {/* 欢迎语 */}
          <motion.p
            className="font-bold text-md text-muted-foreground mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typewriter words={[helloTitle]} />
          </motion.p>

          {/* 轮播图 */}
          <motion.div
            className="mt-4 mb-6 shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Carousel
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              className="w-full select-none"
            >
              <CarouselContent>
                {Array.from({ length: 2 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="bg-[url(/images/950_1x_shots_so.png)] shadow-md bg-cover rounded-md w-full h-[300px]">
                      <div className="h-full px-6 py-6 flex flex-col gap-4">
                        <div>
                          <h1 className="text-xl text-black">不会做攻略？</h1>
                          <p className="text-3xl font-bold text-black">
                            试试{" "}
                            <span className="text-orange-500 font-bold">
                              AI
                            </span>{" "}
                            旅行规划
                          </p>
                        </div>
                        <div className="mt-auto">
                          <Button className="bg-black text-white hover:bg-black/80">
                            去试试 <ChevronsRight />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              {isMobile ? null : <CarouselNext />}
            </Carousel>
          </motion.div>

          {/* AI规划部分 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <p className="text-xl font-bold">AI规划</p>
            <div className="w-full mt-4 rounded-md flex flex-col md:flex-row items-start gap-4">
              <MapComponent
                showZoomLevel={false}
                className="w-full md:w-3/4 h-[300px] md:h-[500px] rounded-md shadow-md"
                center={[45.774835, 126.617682]}
              />
              <div className="w-full md:w-1/4 mt-4 md:mt-0 flex flex-col gap-4 shadow-md md:h-[500px] rounded-md bg-background p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold">
                  试试 <span className="text-orange-500">AI 旅行规划</span>
                </h1>
                <div className="flex flex-col gap-3 md:gap-4 mt-2 md:mt-4">
                  <div className="space-y-1 md:space-y-2">
                    <label className="text-sm font-medium">目的地</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value="哈尔滨"
                        disabled
                        className="w-full px-3 py-2 text-sm md:text-base border rounded-md bg-muted"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <label className="text-sm font-medium">预算 (元)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="最低预算"
                        className="w-full px-3 py-2 text-sm md:text-base border rounded-md"
                      />
                      <span className="text-sm">~</span>
                      <input
                        type="number"
                        placeholder="最高预算"
                        className="w-full px-3 py-2 text-sm md:text-base border rounded-md"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <label className="text-sm font-medium">游玩天数</label>
                    <input
                      type="number"
                      placeholder="请输入天数"
                      className="w-full px-3 py-2 text-sm md:text-base border rounded-md"
                    />
                  </div>
                  <Button variant="tw" className="w-full mt-2 md:mt-4 text-sm">
                    开始规划 <ChevronsRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 热门景点推荐 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-10"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xl font-bold">热门景点推荐</p>
              <Button variant="ghost" size="sm" className="text-sm">
                查看更多
                <ChevronsRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="flex md:grid md:grid-cols-4 gap-4 pb-2 overflow-x-auto snap-x snap-mandatory">
              <SpotCard
                name="哈尔滨冰雪大世界"
                rating="5.0"
                description="冬季最佳，冰灯艺术的盛宴"
                imageUrl="/images/djt.jpeg"
              />

              <SpotCard
                name="中央大街"
                rating="4.8"
                description="全年适宜，欧式建筑风情"
                imageUrl="/images/djt.jpeg"
              />

              <SpotCard
                name="索菲亚教堂"
                rating="4.7"
                description="全年适宜，巴洛克风格建筑"
                imageUrl="/images/djt.jpeg"
              />

              <SpotCard
                name="太阳岛风景区"
                rating="4.6"
                description="夏季最佳，自然风光与雕塑艺术"
                imageUrl="/images/djt.jpeg"
              />
            </div>
          </motion.div>

          {/* 全景点展示 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-10 mb-10"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xl font-bold">全部景点</p>
            </div>

            <div className="bg-background rounded-lg shadow-md overflow-hidden">
              <div className="h-64 md:h-80 relative">
                <div className="absolute inset-0 bg-[url(/images/bg-all-jd.png)] bg-cover bg-center"></div>
                <div className="absolute inset-0 backdrop-blur-sm bg-black/30 flex flex-col items-center justify-center p-4">
                  <div className="text-white text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">不知道哈尔滨有什么？</h2>
                    <p className="text-xl md:text-2xl font-semibold mt-1">哈尔滨全部景点</p>
                    <Button
                      variant="outline"
                      size="lg"
                      className="mt-5 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white"
                    >
                      立即探索 <Navigation className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// 获取当前时间状态,设定欢迎语
export function getTimeState() {
  let timeNow = new Date();
  let hours = timeNow.getHours();
  let state = "";

  if (hours >= 0 && hours <= 9) {
    state = "早上好";
  } else if (hours >= 10 && hours <= 13) {
    state = "中午好";
  } else if (hours >= 14 && hours <= 17) {
    state = "下午好";
  } else {
    state = "晚上好";
  }
  return state;
}
