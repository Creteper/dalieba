"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Star, Navigation, Play, Pause, MapPin, Map } from "lucide-react";
import MapComponent from "@/components/map/MapComponent";
import ScenicSpot from "@/lib/scenic-spot";
import AiChat from "@/lib/ai-chat";
import {
  StarredScenicSpotResponse,
  GuideScenicSpotResponse,
  ScenicSpotResponse,
} from "@/types/article";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ControlBar from "@/components/ui/control-bar";
import UserClient from "@/lib/use-client";
import { calculateDistance } from "@/lib/pos-split";
import ScenicSpotHeader from "@/components/scenic-spot/header";

export default function ScenicSpotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scenicSpotId = params.scenicspotId as string;
  const scenicSpot = new ScenicSpot();
  const aiChat = new AiChat();
  const userClient = new UserClient();
  const [isLoading, setIsLoading] = useState(true);
  const [spotDetail, setSpotDetail] = useState<any>(null);
  const [isStarred, setIsStarred] = useState(false);
  const [isGuiding, setIsGuiding] = useState(false);
  const [guideMessage, setGuideMessage] = useState("");
  const [center, setCenter] = useState<[number, number]>([
    45.774835, 126.617682,
  ]);
  const [isShowGuide, setIsShowGuide] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeech, setCurrentSpeech] =
    useState<SpeechSynthesisUtterance | null>(null);
  // 添加附近景点状态
  const [nearbySpots, setNearbySpots] = useState<
    Array<{
      id: number;
      name: string;
      distance: string; // 格式化后的距离，如"1.2公里"
      actualDistance: number; // 实际距离，用于排序
      type: "attraction";
    }>
  >([]);

  // 获取景点详情和收藏状态
  useEffect(() => {
    const checkToken = async () => {
      const isValid = await userClient.verifyToken();
      if (!isValid) {
        // 如果token无效， 跳转登录页
        router.push("/login");
      }
    };

    checkToken();

    async function fetchData() {
      setIsLoading(true);
      try {
        // 获取所有景点
        const allScenicSpotRes =
          await scenicSpot.getAllScenicSpot<ScenicSpotResponse>();
        if (!allScenicSpotRes?.sights) {
          toast.error("获取景点信息失败");
          router.push("/allScenicSpot");

          return;
        }

        let spot;
        if (scenicSpotId != "all") {
          // 找到对应ID的景点
          spot = allScenicSpotRes.sights.find(
            (s) => s.id === Number(scenicSpotId)
          );
          if (!spot) {
            toast.error("找不到该景点信息");
            router.push("/allScenicSpot");
            return;
          }
        } else {
          spot = allScenicSpotRes.sights;
        }

        setSpotDetail(spot);

        // 设置地图中心
        if (Array.isArray(spot)) {
          // 如果是数组（"all"情况），使用第一个景点的位置或默认值
          if (spot.length > 0 && spot[0].localtion) {
            const [lat, lng] = spot[0].localtion.split(",");
            setCenter([Number(lng), Number(lat)]);
          }
        } else if (spot.localtion) {
          // 单个景点情况
          const [lat, lng] = spot.localtion.split(",");
          setCenter([Number(lng), Number(lat)]);

          // 计算附近景点
          if (allScenicSpotRes.sights.length > 0) {
            const currentLat = Number(lat);
            const currentLng = Number(lng);

            // 过滤出其他景点并计算距离
            const spotsWithDistance = allScenicSpotRes.sights
              .filter((s) => s.id !== Number(scenicSpotId) && s.localtion) // 排除当前景点
              .map((s) => {
                const [otherLat, otherLng] = s.localtion.split(",").map(Number);
                const distance = calculateDistance(
                  currentLat,
                  currentLng,
                  otherLat,
                  otherLng
                );

                return {
                  id: s.id,
                  name: s.name,
                  distance:
                    distance < 1
                      ? `${Math.round(distance * 1000)}米`
                      : `${distance.toFixed(1)}公里`,
                  actualDistance: distance,
                  type: "attraction" as const,
                };
              })
              .filter((s) => s.actualDistance < 10) // 只显示10公里内的景点
              .sort((a, b) => a.actualDistance - b.actualDistance) // 按距离排序
              .slice(0, 5); // 取最近的5个

            setNearbySpots(spotsWithDistance);
          }
        }

        // 获取手残状态
        if (localStorage.getItem("token")) {
          const starredData = await scenicSpot.getStarredScenicSpot<{
            book_mark: any[];
          }>();
          if (
            starredData &&
            starredData.book_mark &&
            Array.isArray(starredData.book_mark)
          ) {
            const isInStarred = starredData.book_mark.some(
              (item) => item.gd_id === Number(scenicSpotId)
            );
            setIsStarred(isInStarred);
          }
        }
      } catch (error) {
        console.error("获取景点详情失败", error);
        toast.error("获取景点详情失败");
      } finally {
        setIsLoading(false);
      }
    }

    if (scenicSpotId) {
      fetchData();
    }
  }, [scenicSpotId]);

  // 播放语音
  const playSpeech = (text: string) => {
    if (isPlaying && currentSpeech) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "zh-CN";
    speech.rate = 1;
    speech.pitch = 1;

    speech.onend = () => {
      setIsPlaying(false);
      setCurrentSpeech(null);
    };

    window.speechSynthesis.speak(speech);
    setCurrentSpeech(speech);
    setIsPlaying(true);
  };

  // 处理AI导游
  const handleGuide = async () => {
    if (!spotDetail || !spotDetail.name) {
      toast.error("景点信息不完整");
      return;
    }

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.error("请先登录");
      router.push("/login");
      return;
    }

    setIsGuiding(true);
    try {
      const res: GuideScenicSpotResponse =
        await aiChat.guideScenicSpot<GuideScenicSpotResponse>(
          spotDetail.name,
          userId
        );

      if (res.status === 200) {
        setGuideMessage(res.data);
        setIsShowGuide(true);
        // 自动播放导游内容
        setTimeout(() => playSpeech(res.data), 500);
      } else {
        toast.error("导游失败，请重试" + res.message);
      }
    } catch (error: any) {
      toast.error("导游失败，请重试" + error.message);
    } finally {
      setIsGuiding(false);
    }
  };

  // 处理收藏/取消收藏
  const handleStarToggle = async () => {
    if (!spotDetail) return;

    if (!localStorage.getItem("token")) {
      toast.error("请先登录");
      router.push("/login");
      return;
    }

    try {
      const spotData: StarredScenicSpotResponse = {
        id: spotDetail.id,
        pname: spotDetail.pname || "",
        city_name: spotDetail.city_name || "",
        adname: spotDetail.adname || "",
        name: spotDetail.name || "",
        address: spotDetail.address || "",
        localtion: spotDetail.localtion || "",
      };

      if (isStarred) {
        // 取消收藏
        await scenicSpot.deleteStarredScenicSpot(spotData);
        setIsStarred(false);
        toast.success("已取消收藏");
      } else {
        // 添加收藏
        await scenicSpot.addStarredScenicSpot(spotData);
        setIsStarred(true);
        toast.success("已添加到收藏");
      }
    } catch (error) {
      console.error("收藏操作失败:", error);
      toast.error("操作失败，请重试");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!spotDetail) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <p className="text-lg font-medium mb-4">景点信息不存在</p>
        <Button onClick={() => router.push("/allScenicSpot")}>
          返回景点列表
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-screen bg-background"
    >
      <ControlBar
        className="fixed top-4 right-4 z-50"
        variant="reversalDefault"
      />

      <ScenicSpotHeader spotDetail={spotDetail} />

      {/* 内容区域 - 添加滚动动画 */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧内容 */}
          <motion.div
            className="w-full lg:w-2/3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/10">
              {/* 景点介绍卡片 */}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="inline-block w-1 h-4 bg-primary rounded-full"></span>
                  </div>
                  景点介绍
                </h2>

                <div className="bg-muted/30 rounded-lg p-4 border border-border/5 text-muted-foreground">
                  <p>{spotDetail.address}</p>
                  {guideMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 pt-4 border-t border-border/30"
                    >
                      <div className="flex items-center mb-2">
                        <Navigation className="h-4 w-4 mr-2 text-primary" />
                        <h3 className="font-medium">AI导游亮点:</h3>
                      </div>
                      <p className="text-sm line-clamp-3">
                        {guideMessage.split(".").slice(0, 2).join(".")}...
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-8 text-xs text-primary"
                        onClick={() => setIsShowGuide(true)}
                      >
                        查看完整介绍
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* 地图部分 */}
              <div className="p-6 pt-0">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  位置
                  <div className="flex items-center justify-center ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (Array.isArray(spotDetail)) {
                          router.push(`/allScenicSpot/all`);
                        } else {
                          router.push(`/allScenicSpot/${spotDetail.id}`);
                        }
                      }}
                    >
                      <Map className="h-4 w-4 mr-2" />
                      地图查看
                    </Button>
                  </div>
                </h2>

                <div className="h-[300px] rounded-xl overflow-hidden border border-border/10 shadow-sm hover:shadow transition-all duration-300">
                  <MapComponent
                    showZoomLevel={false}
                    className="w-full h-full"
                    center={center}
                    zoom={15}
                    markers={[
                      {
                        position: center,
                        popup: spotDetail.name,
                        icon: {
                          url: "/images/location-custom.svg",
                          size: [32, 32],
                          anchor: [16, 16],
                        },
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧操作区 - 添加悬停效果 */}
          <motion.div
            className="w-full lg:w-1/3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-card rounded-xl shadow-md p-6 mb-4 sticky top-20 border border-border/10"
            >
              {/* 互动按钮区 */}
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={isStarred ? "default" : "outline"}
                    size="lg"
                    className={`w-full group ${
                      isStarred
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                        : ""
                    }`}
                    onClick={handleStarToggle}
                  >
                    <Star
                      className={`mr-2 h-5 w-5 transition-all ${
                        isStarred
                          ? "fill-white text-white"
                          : "group-hover:scale-110"
                      }`}
                    />
                    {isStarred ? "已收藏" : "收藏景点"}
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    disabled={isGuiding}
                    onClick={handleGuide}
                  >
                    {isGuiding ? (
                      <span className="flex items-center">
                        <Navigation className="mr-2 h-5 w-5 animate-pulse" />
                        正在生成导游讲解
                        <span className="ml-2 flex">
                          <motion.span
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                            className="mx-0.5 h-1.5 w-1.5 rounded-full bg-white"
                          ></motion.span>
                          <motion.span
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                              delay: 0.2,
                            }}
                            className="mx-0.5 h-1.5 w-1.5 rounded-full bg-white"
                          ></motion.span>
                          <motion.span
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                              delay: 0.4,
                            }}
                            className="mx-0.5 h-1.5 w-1.5 rounded-full bg-white"
                          ></motion.span>
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Navigation className="mr-2 h-5 w-5" />
                        AI 智能导游
                      </span>
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* 景点信息卡片 */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="text-sm font-medium flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 mr-1 text-primary"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  景点信息
                </h3>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start bg-muted/30 p-2 rounded-md">
                    <span className="font-medium text-foreground/80 w-16 flex-shrink-0">
                      所在地
                    </span>
                    <span>
                      {spotDetail.city_name} · {spotDetail.adname}
                    </span>
                  </div>

                  <div className="flex items-start bg-muted/30 p-2 rounded-md">
                    <span className="font-medium text-foreground/80 w-16 flex-shrink-0">
                      省份
                    </span>
                    <span>{spotDetail.pname}</span>
                  </div>

                  <div className="flex items-start bg-muted/30 p-2 rounded-md">
                    <span className="font-medium text-foreground/80 w-16 flex-shrink-0">
                      最佳季节
                    </span>
                    <span>全年皆宜，冬季有冰雪景观</span>
                  </div>

                  <div className="flex items-start bg-muted/30 p-2 rounded-md">
                    <span className="font-medium text-foreground/80 w-16 flex-shrink-0">
                      开放时间
                    </span>
                    <span>全天开放</span>
                  </div>
                </div>
              </div>

              {/* 热门推荐 */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="text-sm font-medium flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 mr-1 text-primary"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                  附近推荐
                </h3>

                <div className="space-y-3">
                  {nearbySpots.length > 0 ? (
                    nearbySpots.map((spot) => (
                      <motion.div
                        key={spot.id}
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => router.push(`/scenicSpot/${spot.id}`)}
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-primary"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{spot.name}</div>
                          <div className="text-xs text-muted-foreground">
                            距离约{spot.distance}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground py-2">
                      附近暂无推荐景点
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 导游内容弹窗 - 优化样式和交互 */}
      {isShowGuide && (
        <motion.div
          id="guide-dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-card/95 backdrop-blur-md rounded-xl shadow-xl border border-border/20 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/10">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Navigation className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-medium">AI智能导游</h3>
                <div className="flex items-center ml-3 bg-primary/10 rounded-full px-2 py-0.5 text-xs font-medium text-primary">
                  {spotDetail.name}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted text-muted-foreground"
                  onClick={() => playSpeech(guideMessage)}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted text-muted-foreground"
                  onClick={() => {
                    setIsShowGuide(false);
                    setIsPlaying(false);
                    if (currentSpeech) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 markdown">
              <div className="prose prose-sm md:prose-base max-w-none prose-img:rounded-md prose-headings:text-foreground prose-headings:font-semibold prose-p:text-muted-foreground prose-strong:text-foreground/80 prose-strong:font-medium">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-xl font-bold mt-6 mb-4" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-lg font-semibold mt-5 mb-3"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-base font-medium mt-4 mb-2"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="my-2 text-muted-foreground" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="my-2 ml-6 list-disc" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="my-2 ml-6 list-decimal" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="my-1" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-muted pl-4 my-2 italic"
                        {...props}
                      />
                    ),
                  }}
                >
                  {guideMessage}
                </ReactMarkdown>
              </div>
            </div>

            {/* 添加底部操作栏 */}
            <div className="border-t border-border/10 p-4 flex justify-between items-center bg-muted/30">
              <div className="text-sm text-muted-foreground">
                AI生成内容仅供参考
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                  }
                  navigator.clipboard.writeText(guideMessage);
                  toast.success("导游内容已复制到剪贴板");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
                复制文本
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
