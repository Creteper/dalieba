"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Navigation, Play, Pause } from "lucide-react";
import MapComponent from "@/components/map/MapComponent";
import ScenicSpot from "@/lib/scenic-spot";
import AiChat from "@/lib/ai-chat";
import { StarredScenicSpotResponse, GuideScenicSpotResponse, ScenicSpotResponse } from "@/types/article";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ControlBar from "@/components/ui/control-bar";
import UserClient from "@/lib/use-client";

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
  const [center, setCenter] = useState<[number, number]>([45.774835, 126.617682]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);

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
        const allScenicSpotRes = await scenicSpot.getAllScenicSpot<ScenicSpotResponse>();
        if (!allScenicSpotRes?.sights) {
          toast.error("获取景点信息失败");
          router.push("/allScenicSpot");
          return;
        }

        // 找到对应ID的景点
        const spot = allScenicSpotRes.sights.find(s => s.id === Number(scenicSpotId));
        if (!spot) {
          toast.error("找不到该景点信息");
          router.push("/allScenicSpot");
          return;
        }

        setSpotDetail(spot);
        
        // 设置地图中心
        if (spot.localtion) {
          const [lat, lng] = spot.localtion.split(",");
          setCenter([Number(lng), Number(lat)]);
        }

        // 获取收藏状态
        if (localStorage.getItem("token")) {
          const starredData = await scenicSpot.getStarredScenicSpot<{book_mark: any[]}>(); 
          if (starredData && starredData.book_mark && Array.isArray(starredData.book_mark)) {
            const isInStarred = starredData.book_mark.some(item => item.gd_id === Number(scenicSpotId));
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
    speech.lang = 'zh-CN';
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
      const res: GuideScenicSpotResponse = await aiChat.guideScenicSpot<GuideScenicSpotResponse>(
        spotDetail.name, 
        userId
      );

      if (res.status === 200) {
        setGuideMessage(res.data);
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
        localtion: spotDetail.localtion || ""
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
        <Button onClick={() => router.push("/allScenicSpot")}>返回景点列表</Button>
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

      {/* 顶部图片区域 */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('/images/djt.jpeg')` }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col">
          <div className="container mx-auto px-4 h-full flex flex-col">
            <Button
              variant="outline"
              size="icon"
              className="mt-16 w-10 h-10 rounded-full bg-background/30 backdrop-blur-md hover:bg-background/50 text-white self-start transition-all duration-300 hover:scale-105"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="mt-auto mb-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-white drop-shadow-md"
              >
                {spotDetail.name}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center mt-2"
              >
                <div className="flex items-center text-yellow-400">
                  <Star className="fill-current h-5 w-5 mr-1" />
                  <span className="text-white text-sm">4.8</span>
                </div>
                <span className="text-white/80 text-sm mx-2">|</span>
                <span className="text-white/80 text-sm">{spotDetail.address}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧内容 */}
          <div className="w-full md:w-2/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-3">
                <span className="inline-block w-1 h-6 bg-primary rounded-full mr-2"></span>
                景点介绍
              </h2>
              <p className="text-muted-foreground">
                {spotDetail.address}
              </p>
              
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-3">
                  <span className="inline-block w-1 h-6 bg-primary rounded-full mr-2"></span>
                  位置
                </h2>
                <div className="h-[200px] rounded-lg overflow-hidden border border-border/50">
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
                      }
                    ]}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* 右侧操作区 */}
          <div className="w-full md:w-1/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card rounded-xl shadow-md p-6 mb-4 sticky top-20"
            >
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant={isStarred ? "default" : "outline"}
                  size="lg"
                  className={`w-full transition-all duration-300 hover:scale-102 ${isStarred ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500" : ""}`}
                  onClick={handleStarToggle}
                >
                  <Star className={`mr-2 h-5 w-5 ${isStarred ? "fill-white text-white" : ""}`} />
                  {isStarred ? "已收藏" : "收藏景点"}
                </Button>
              </div>
              
              <Button
                variant="tw"
                size="lg"
                className="w-full transition-all duration-300 hover:scale-102"
                disabled={isGuiding}
                onClick={handleGuide}
              >
                <Navigation className="mr-2 h-5 w-5" />
                {isGuiding ? 
                  <span className="flex items-center">
                    导游中
                    <span className="ml-2 flex">
                      <span className="animate-bounce mx-0.5 h-1.5 w-1.5 rounded-full bg-white"></span>
                      <span className="animate-bounce mx-0.5 h-1.5 w-1.5 rounded-full bg-white" style={{animationDelay: "0.2s"}}></span>
                      <span className="animate-bounce mx-0.5 h-1.5 w-1.5 rounded-full bg-white" style={{animationDelay: "0.4s"}}></span>
                    </span>
                  </span> 
                  : "AI 导游"
                }
              </Button>

              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">其他信息</h3>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-start mb-3">
                    <span className="font-medium w-20">城市：</span>
                    <span>{spotDetail.city_name}</span>
                  </div>
                  <div className="flex items-start mb-3">
                    <span className="font-medium w-20">省份：</span>
                    <span>{spotDetail.pname}</span>
                  </div>
                  <div className="flex items-start mb-3">
                    <span className="font-medium w-20">行政区：</span>
                    <span>{spotDetail.adname}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 导游内容弹窗 */}
      {guideMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center sm:justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-background/95 backdrop-blur-md rounded-xl shadow-xl border border-border/50"
          >
            <div className="flex items-start justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-medium flex items-center">
                  <Navigation className="mr-2 h-4 w-4 text-primary" />
                  AI 导游 - {spotDetail.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playSpeech(guideMessage)}
                  className="h-8 w-8 p-0 rounded-full hover:bg-muted/80"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setGuideMessage("");
                  setIsPlaying(false);
                  if (currentSpeech) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="h-8 w-8 p-0 rounded-full hover:bg-muted/80"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 prose prose-sm md:prose-base max-w-none">
              <div className="text-muted-foreground [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mt-5 [&>h2]:mb-3 [&>h3]:text-base [&>h3]:font-medium [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:my-2 [&>ul]:my-2 [&>ol]:my-2 [&>li]:my-1 [&>blockquote]:border-l-4 [&>blockquote]:border-muted [&>blockquote]:pl-4 [&>blockquote]:my-2 [&>blockquote]:italic [&>code]:bg-muted/50 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>pre]:bg-muted/50 [&>pre]:p-3 [&>pre]:rounded [&>pre]:my-2 [&>pre]:overflow-x-auto [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4 [&>a]:hover:text-primary/80 [&>table]:w-full [&>table]:my-4 [&>table]:border-collapse [&>th]:border [&>th]:border-muted [&>th]:p-2 [&>td]:border [&>td]:border-muted [&>td]:p-2">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {guideMessage}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
