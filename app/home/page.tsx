/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-22 13:16:50
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-10 09:42:35
 * @FilePath: \dalieba\app\home\page.tsx
 * @Description: 用于显示首页内容
 */

"use client";

import { useEffect, useState } from "react";
import * as React from "react";
import ControlBar from "@/components/ui/control-bar";
import { Typewriter } from "react-simple-typewriter";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  ChevronsRight,
  Camera,
  Navigation,
  Car,
  Bus,
  Footprints,
  MapPin,
  Menu,
  X,
  Map,
  Clock,
  BookOpen,
  UserRound,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parkinglotData, hotelData, foodData } from "@/lib/data-static";
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
import {
  RecommendScenicSpotResponse,
  StarredScenicSpotResponse,
} from "@/types/article";
import SpotCard from "@/components/home/componentsHome/spot-card";
import ScenicSpot from "@/lib/scenic-spot";
import { toast } from "sonner";
import CalcTime from "@/components/home/componentsHome/calc-time";
import TripCard, {
  TripCardType,
} from "@/components/home/componentsHome/tripCard";
import { ServerConfig } from "@/lib/site";
import { ReplaceParentheses } from "@/lib/scenic-spot";
import { tripData } from "@/lib/data-static";

// 悬浮吉祥物组件
const FloatingMascot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false); // 导航后关闭菜单
  };

  const menuItems = [
    { icon: <BookOpen size={20} />, label: "AI旅行规划", path: "/createplan" },
    {
      icon: <MapPin size={20} />,
      label: "全部景点",
      path: "/allScenicSpot/all",
    },
    { icon: <Clock size={20} />, label: "交通计算", path: "/calcTraffic" },
    { icon: <Map size={20} />, label: "推荐路线", path: "/routeRecommend" },
    { icon: <UserRound size={20} />, label: "个人中心", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2"
          >
            <div className="flex flex-col space-y-1">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 p-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMenu}
        className="bg-primary shadow-lg rounded-full w-16 h-16 flex items-center justify-center"
      >
        {isOpen ? (
          <X className="text-white dark:text-black" size={24} />
        ) : (
          <div className="relative">
            <img
              src="/images/logo.svg"
              alt="吉祥物"
              className="w-10 h-10 object-contain"
            />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              5
            </span>
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default function HomePage() {
  const [helloTitle, setHelloTitle] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const userClient = new UserClient();
  const scenicSpot = new ScenicSpot();
  const [myRecommendScenicSpot, setMyRecommendScenicSpot] =
    useState<RecommendScenicSpotResponse>({ sights: [] });
  const [isLoading, setIsLoading] = useState(true);
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
    setHelloTitle(getTimeState() + "，来试试AI旅行规划");
  }, [pathname]);
  
  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function getRecommendScenicSpot() {
      setIsLoading(true);
      try {
        const recommendScenicSpot =
          await scenicSpot.recommendScenicSpot<RecommendScenicSpotResponse>();
        setMyRecommendScenicSpot(recommendScenicSpot);
      } catch (error) {
        console.error("获取推荐景点失败:", error);
      } finally {
        setIsLoading(false);
      }
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
          const starredData = await scenicSpot.getStarredScenicSpot<{
            code: number;
            data: StarredScenicSpotResponse[];
          }>();
          if (starredData.code === 0 && starredData.data) {
            const ids = starredData.data.map((item) => item.id);
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
      const spot = myRecommendScenicSpot?.sights?.find((s) => s.id === id);
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
        localtion: spot.localtion || "",
      };

      if (starredIds.includes(id)) {
        // 取消收藏
        await scenicSpot.deleteStarredScenicSpot(spotData);
        setStarredIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("已取消收藏");
      } else {
        // 添加收藏
        await scenicSpot.addStarredScenicSpot(spotData);
        setStarredIds((prev) => [...prev, id]);
        toast.success("已添加到收藏");
      }
    } catch (error) {
      toast.error("操作失败，请重试");
    }
  };

  // 处理点击景点卡片
  const handleSpotClick = (id: number, name: string) => {
    // 跳转到景点详情页
    if (isLogin) {
      router.push(`/scenicSpot/${id}`);
    } else {
      router.push("/login");
    }
  };

  const handleRouteClick = (item: TripCardType) => {
    router.push("/routeRecommend/" + item.id);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 固定导航栏 */}
      <div className="w-full h-48 bg-[url('/images/bg-mountain.png')] bg-cover bg-center">
        <motion.div
          className={`w-full h-[60px] fixed top-0 z-50 backdrop-blur-xl transition-colors duration-300 ${
            scrolled ? "bg-background/90 shadow-sm" : "bg-transparent"
          }`}
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
              <p
                className={`font-bold text-xl ${
                  scrolled ? "text-black dark:text-white" : "text-white"
                }`}
              >
                GO! TOGETHER
              </p>
            </div>
            <ControlBar variant="outline" className="static ml-auto mr-4" />
          </nav>
        </motion.div>
      </div>

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
          <div className="flex items-center justify-center w-full mt-4">
            <SearchBox className="w-full!" />
          </div>
          {/* 轮播图 */}
          <motion.div
            className="mt-4 mb-6 grid grid-cols-1 gap-4 md:grid-cols-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Carousel
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              className=" select-none w-full"
            >
              <CarouselContent>
                {Array.from({ length: 1 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="bg-[url(/images/998shots_so.png)] shadow-md bg-cover rounded-md w-full h-[300px]">
                      <div className="h-full px-6 py-6 flex flex-col gap-4">
                        <div>
                          <h1 className="text-xl text-black">不会做攻略？</h1>
                          <p className="text-3xl font-bold text-black">
                            试试{" "}
                            <span className="text-primary font-bold">AI</span>{" "}
                            旅行规划
                          </p>
                        </div>
                        <div className="mt-auto">
                          <Button
                            className="bg-black text-white hover:bg-black/80"
                            onClick={() => {
                              if (isLogin) {
                                router.push("/createplan");
                              } else {
                                router.push("/login");
                              }
                            }}
                          >
                            去试试 <ChevronsRight />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
                <CarouselItem>
                  <div className="bg-background rounded-lg shadow-md overflow-hidden">
                    <div className=" h-[300px] relative">
                      <div className="absolute inset-0 bg-[url(/images/541shots_so.png)] bg-cover bg-center"></div>
                      <div className="absolute inset-0 flex flex-col p-6">
                        <div className="text-white">
                          <h2 className="text-sm font-bold mb-2">
                            不知道哈尔滨有什么？
                          </h2>
                          <p className="text-md md:text-2xl font-semibold mt-1">
                            哈尔滨全部景点
                          </p>
                        </div>
                        <div className="mt-auto">
                          <Button
                            onClick={() => {
                              if (isLogin) {
                                router.push("/allScenicSpot/all");
                              } else {
                                router.push("/login");
                              }
                            }}
                            variant="reversalDefault"
                          >
                            {isLogin ? "立即探索" : "立即登录"}{" "}
                            <Navigation className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              {isMobile ? null : <CarouselNext />}
            </Carousel>
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="bg-cover rounded-xl w-full h-[300px] grid grid-cols-2 grid-rows-2 gap-4">
                {/* AI旅行规划 */}
                <div
                  className="relative overflow-hidden rounded-lg group shadow-sm border border-border/20 transition-all hover:scale-105"
                  onClick={() => {
                    if (isLogin) {
                      router.push("/createplan");
                    } else {
                      router.push("/login");
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 to-blue-700"></div>
                  <div className="absolute inset-0 p-4 flex flex-col h-full">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">AI旅行规划</h3>
                    <p className="text-sm text-white/80 mt-1">
                      智能生成个性化行程路线
                    </p>
                  </div>
                </div>

                {/* 全部景点 */}
                <div
                  className="relative overflow-hidden rounded-lg group shadow-sm border border-border/20 transition-all hover:scale-105"
                  onClick={() => {
                    if (isLogin) {
                      router.push("/allScenicSpot/all");
                    } else {
                      router.push("/login");
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-[url(/images/541shots_so.png)] bg-cover bg-center"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute inset-0 p-4 flex flex-col h-full">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">全部景点</h3>
                    <p className="text-sm text-white/80 mt-1">
                      探索哈尔滨精选旅游景点
                    </p>
                  </div>
                </div>

                {/* 交通时间计算 */}
                <div
                  className="relative overflow-hidden rounded-lg group shadow-sm border border-border/20 transition-all hover:scale-105"
                  onClick={() => {
                    if (isLogin) {
                      router.push("/calcTraffic");
                    } else {
                      router.push("/login");
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/90 to-emerald-700"></div>
                  <div className="absolute inset-0 p-4 flex flex-col h-full">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-white"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      交通时间计算
                    </h3>
                    <p className="text-sm text-white/80 mt-1">
                      三种出行方式精确计算路程
                    </p>
                  </div>
                </div>

                {/* 导游服务 */}
                <div
                  className="relative overflow-hidden rounded-lg group shadow-sm border border-border/20 transition-all hover:scale-105"
                  onClick={() => {
                    if (isLogin) {
                      router.push("/routeRecommend");
                    } else {
                      router.push("/login");
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/90 to-amber-700"></div>
                  <div className="absolute inset-0 p-4 flex flex-col h-full">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">推荐路线</h3>
                    <p className="text-sm text-white/80 mt-1">
                      精选热门旅行路线和攻略
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="w-full h-[200px] rounded-lg"
                    />
                  ))
                : myRecommendScenicSpot?.sights
                    ?.slice(0, 4)
                    .map((spot, index) => (
                      <SpotCard
                        description=""
                        key={index}
                        id={spot.id || index + 1}
                        name={spot.name || `景点${index + 1}`}
                        rating={(4.5 - index * 0.1).toFixed(1)}
                        location={spot.address || "哈尔滨热门景点"}
                        imageUrl={
                          ServerConfig.userApiUrl +
                          "/img/" +
                          ReplaceParentheses(spot.name) +
                          ".jpg"
                        }
                        isStarred={starredIds.includes(spot.id || index + 1)}
                        onStarClick={(id) => handleStarClick(id)}
                        onClick={() =>
                          handleSpotClick(
                            spot.id || index + 1,
                            spot.name || `景点${index + 1}`
                          )
                        }
                        className="w-full h-full"
                      />
                    ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <p className="text-xl font-bold mt-10">推荐</p>
            <Tabs defaultValue="parkinglot" className=" w-full mt-4">
              <TabsList className="gird w-full gird-cols-4 md:w-[400px]">
                <TabsTrigger
                  value="parkinglot"
                  className="w-full data-[state=active]:bg-background"
                >
                  停车场
                </TabsTrigger>
                <TabsTrigger
                  value="hotel"
                  className="w-full data-[state=active]:bg-background"
                >
                  住宿
                </TabsTrigger>
                <TabsTrigger
                  value="food"
                  className="w-full data-[state=active]:bg-background"
                >
                  美食
                </TabsTrigger>
                <TabsTrigger
                  value="traffic"
                  className="w-full data-[state=active]:bg-background"
                >
                  交通
                </TabsTrigger>
              </TabsList>
              <TabsContent value="parkinglot" className="w-full">
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  {parkinglotData.map((item) => (
                    <SpotCard
                      description=""
                      className="w-full h-full"
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      rating={item.rating.toString()}
                      imageUrl={item.imageUrl}
                      showStar={false}
                      location={item.address}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="hotel">
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  {hotelData.map((item) => (
                    <SpotCard
                      description={item.description || ""}
                      className="w-full h-full"
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      rating={item.rating.toString()}
                      imageUrl={item.imageUrl}
                      showStar={false}
                      location={item.address}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="food">
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  {foodData.map((item) => (
                    <SpotCard
                      description={item.description || ""}
                      className="w-full h-full"
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      rating={item.rating.toString()}
                      imageUrl={item.imageUrl}
                      showStar={false}
                      location={item.address}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="traffic">
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CalcTime
                      type="taxi"
                      icon={<Car className="h-6 w-6" />}
                      title="打车"
                    />
                    <CalcTime
                      type="bus"
                      icon={<Bus className="h-6 w-6" />}
                      title="公交"
                    />
                    <CalcTime
                      type="walk"
                      icon={<Footprints className="h-6 w-6" />}
                      title="步行"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mt-10">
              <p className="text-xl font-bold">推荐路线</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={() => router.push("/routeRecommend")}
              >
                查看更多
                <ChevronsRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tripData.map((item) => {
                  return (
                    <TripCard
                      onClick={(item) => handleRouteClick(item)}
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      days={item.days}
                      location={item.location}
                      bestSeason={item.bestSeason}
                      highlights={item.highlights}
                      image={item.image}
                      type={item.type}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 悬浮吉祥物 */}
      <FloatingMascot />
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
