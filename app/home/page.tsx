/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-22 13:16:50
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-11 13:44:45
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
import { UserInfoResponse, RecommendScenicSpotResponse, StarredScenicSpotResponse } from "@/types/article";
import SpotCard from "@/components/home/componentsHome/spot-card";
import ScenicSpot from "@/lib/scenic-spot";
import { toast } from "sonner";

export default function HomePage() {
  const [helloTitle, setHelloTitle] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const userClient = new UserClient();
  const scenicSpot = new ScenicSpot();
  const [myRecommendScenicSpot, setMyRecommendScenicSpot] =
    useState<RecommendScenicSpotResponse>({ sights: [] });
  const [isLogin, setIsLogin] = useState(false);
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  const [starredIds, setStarredIds] = useState<number[]>([]);

  useEffect(() => {
    async function checkedToken() {
      const res = await userClient.verifyToken();
      setIsLogin(res);
    }
    checkedToken();
    setHelloTitle(getTimeState() + "，最新旅行资讯");
  }, [pathname]);

  useEffect(() => {
    async function getRecommendScenicSpot() {
      const recommendScenicSpot =
        await scenicSpot.recommendScenicSpot<RecommendScenicSpotResponse>();
      setMyRecommendScenicSpot(recommendScenicSpot);
    }
    getRecommendScenicSpot();
  }, []);

  // 监听状态变化
  useEffect(() => {
    console.log("状态更新:", myRecommendScenicSpot);
  }, [myRecommendScenicSpot]);

  // 获取已收藏的景点
  useEffect(() => {
    const fetchStarredSpots = async () => {
      if (isLogin) {
        try {
          const starredData = await scenicSpot.getStarredScenicSpot<{code: number, data: StarredScenicSpotResponse[]}>(); 
          if (starredData.code === 0 && starredData.data) {
            const ids = starredData.data.map(item => item.id);
            setStarredIds(ids);
          }
        } catch (error) {
          console.error("获取收藏景点失败", error);
        }
      }
    };
    
    fetchStarredSpots();
  }, [isLogin]);

  // 处理收藏/取消收藏
  const handleStarClick = async (id: number) => {
    if (!isLogin) {
      toast.error("请先登录");
      router.push("/login");
      return;
    }

    try {
      // 找到对应的景点数据
      const spot = myRecommendScenicSpot?.sights?.find(s => s.id === id);
      if (!spot) {
        toast.error("景点数据不存在");
        return;
      }

      const spotData: StarredScenicSpotResponse = {
        id: spot.id,
        pname: spot.pname || "",
        city_name: spot.city_name || "",
        adname: spot.adname || "",
        name: spot.name || "",
        address: spot.address || "",
        localtion: spot.localtion || ""
      };

      if (starredIds.includes(id)) {
        // 取消收藏
        await scenicSpot.deleteStarredScenicSpot(spotData);
        setStarredIds(prev => prev.filter(itemId => itemId !== id));
        toast.success("已取消收藏");
      } else {
        // 添加收藏
        await scenicSpot.addStarredScenicSpot(spotData);
        setStarredIds(prev => [...prev, id]);
        toast.success("已添加到收藏");
      }
    } catch (error) {
      toast.error("操作失败，请重试");
    }
  };

  // 处理点击景点卡片
  const handleSpotClick = (id: number, name: string) => {
    // 跳转到景点详情页
    router.push(`/${id}`);
  };

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
      <div className="pt-[60px] w-full flex">
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
              className=" select-none"
            >
              <CarouselContent>
                {Array.from({ length: 1 }).map((_, index) => (
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
                          <Button className="bg-black text-white hover:bg-black/80" onClick={() => router.push("/createplan")}>
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
          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mt-10"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xl font-bold">热门景点推荐</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm"
                  onClick={() => router.push("/allScenicSpotCard")}
                >
                  查看更多
                  <ChevronsRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {myRecommendScenicSpot?.sights?.slice(0, 4).map((spot, index) => (
                  <SpotCard
                    key={index}
                    id={spot.id || index + 1}
                    name={spot.name || `景点${index + 1}`}
                    rating={(4.5 - index * 0.1).toFixed(1)}
                    description={spot.address || "哈尔滨热门景点"}
                    imageUrl="/images/djt.jpeg"
                    isStarred={starredIds.includes(spot.id || index + 1)}
                    onStarClick={(id) => handleStarClick(id)}
                    onClick={() => handleSpotClick(spot.id || index + 1, spot.name || `景点${index + 1}`)}
                    className="w-full h-full"
                  />
                ))}
              </div>
            </motion.div>

          {/* <motion.div
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
          </motion.div> */}

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
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      不知道哈尔滨有什么？
                    </h2>
                    <p className="text-xl md:text-2xl font-semibold mt-1">
                      哈尔滨全部景点
                    </p>
                    <Button
                      onClick={() => {
                        if (isLogin) {
                          router.push("/allScenicSpot");
                        } else {
                          router.push("/login");
                        }
                      }}
                      variant="outline"
                      size="lg"
                      className="mt-5 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white"
                    >
                      {isLogin ? "立即探索" : "立即登录"}{" "}
                      <Navigation className="ml-1 h-4 w-4" />
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
