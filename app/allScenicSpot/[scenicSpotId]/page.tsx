/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-10 10:15:44
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-18 15:24:38
 * @FilePath: \dalieba\app\allScenicSpot\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

"use client";

import MapComponent from "@/components/map/MapComponent";
import { motion } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import ScenicSpot from "@/lib/scenic-spot";
import {
  ScenicSpotResponse,
  GuideScenicSpotResponse,
  StarredScenicSpotResponse,
} from "@/types/article";
import ControlBar from "@/components/ui/control-bar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import AiChat from "@/lib/ai-chat";
import { toast } from "sonner";
import { X, Play, Pause, Home } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useRouter, useParams } from "next/navigation";
import { Search, MapPin, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import UserClient from "@/lib/use-client";
interface PointResponse {
  id: number;
  name: string;
  location: [number, number];
  description: string;
}

interface GuideRecord {
  scenicSpot: string;
  message: string;
}

export default function AllScenicSpotPage() {
  const router = useRouter();
  const params = useParams();
  const scenicSpotId = params?.scenicSpotId
    ? parseInt(params.scenicSpotId as string)
    : null;

  const scenicSpot = new ScenicSpot(); // 景点数据
  const [allScenicSpot, setAllScenicSpot] = useState<ScenicSpotResponse>({
    sights: [],
  }); // 景点数据
  const [points, setPoints] = useState<PointResponse[]>([]); // 景点列表
  const [selectedMarker, setSelectedMarker] = useState<{
    position: [number, number];
    popup?: string;
    description?: string;
    title?: string;
  } | null>(null); // 选中的景点
  const [isExiting, setIsExiting] = useState(false); // 是否退出
  const [searchQuery, setSearchQuery] = useState(""); // 搜索框内容
  const [center, setCenter] = useState<[number, number]>([
    45.774835, 126.617682,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOnGuide, setIsOnGuide] = useState(false);
  const [guideMessage, setGuideMessage] = useState("");
  const [guideRecords, setGuideRecords] = useState<GuideRecord[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeech, setCurrentSpeech] =
    useState<SpeechSynthesisUtterance | null>(null);
  const [highlightedMarker, setHighlightedMarker] = useState<
    [number, number] | null
  >(null);
  const [zoom, setZoom] = useState<number>(12);
  const aiChat = new AiChat(); // AI聊天
  const [starredSpots, setStarredSpots] = useState<number[]>([]); // 已收藏的景点ID列表
  const userClient = new UserClient();
  // 模糊搜索过滤
  const filteredPoints = useMemo(() => {
    if (!searchQuery) return points;
    return points.filter((point) =>
      point.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [points, searchQuery]);

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

  // AI 导游
  async function guideScenicSpot(scenicSpot: string, user_id: string) {
    if (!scenicSpot || !user_id) {
      toast.error("请先登录");
      return;
    }

    // 检查是否已经导游过
    const existingRecord = guideRecords.find(
      (record) => record.scenicSpot === scenicSpot
    );
    if (existingRecord) {
      setGuideMessage(existingRecord.message);
      // 自动播放历史导游内容
      setTimeout(() => playSpeech(existingRecord.message), 500);
      return;
    }

    setIsOnGuide(true);
    try {
      const res: GuideScenicSpotResponse =
        await aiChat.guideScenicSpot<GuideScenicSpotResponse>(
          scenicSpot,
          user_id
        );
      if (res.status === 200) {
        toast.success("导游成功");
        setGuideMessage(res.data);
        setGuideRecords((prev) => [...prev, { scenicSpot, message: res.data }]);
        // 自动播放新导游内容
        setTimeout(() => playSpeech(res.data), 500);
      } else {
        toast.error("导游失败，请重试" + res.message);
      }
    } catch (error: any) {
      toast.error("导游失败，请重试" + error.message);
    }
    setIsOnGuide(false);
  }

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchQuery) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredPoints.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredPoints[selectedIndex]) {
          handleSearchSelect(filteredPoints[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery, filteredPoints, selectedIndex]);

  // 当搜索结果变化时重置选中索引
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredPoints]);

  // 根据scenicSpotId设置中心点和选中的景点
  useEffect(() => {
    if (scenicSpotId && points.length > 0) {
      const targetPoint = points.find((point) => point.id === scenicSpotId);
      if (targetPoint) {
        setSelectedMarker({
          position: targetPoint.location,
          popup: targetPoint.name,
          description: targetPoint.description,
        });
        setCenter(targetPoint.location);
        setHighlightedMarker(targetPoint.location);
        setZoom(15);
      }
    }
  }, [scenicSpotId, points]);

  // 获取所有景点和已收藏景点数据
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
      try {
        // 获取所有景点
        const allScenicSpot =
          await scenicSpot.getAllScenicSpot<ScenicSpotResponse>();
        setAllScenicSpot(allScenicSpot);

        const points = ProcessingPoint(allScenicSpot);
        setPoints(points);

        // 获取已收藏的景点
        if (localStorage.getItem("token")) {
          const starredData = await scenicSpot.getStarredScenicSpot<{
            book_mark: any[];
          }>();
          if (
            starredData &&
            starredData.book_mark &&
            Array.isArray(starredData.book_mark)
          ) {
            const ids = starredData.book_mark.map((item) => item.gd_id);
            setStarredSpots(ids);
            console.log("已收藏景点ID:", ids);
          } else {
            console.error("收藏数据格式错误:", starredData);
          }
        }
      } catch (error) {
        console.error("获取数据失败", error);
      }
    }

    fetchData();
  }, []);

  function handleMarkerClick(marker: {
    position: [number, number];
    popup?: string;
    description?: string;
    title?: string;
  }) {
    if (selectedMarker) {
      setIsExiting(true);
      setTimeout(() => {
        setSelectedMarker(marker);
        setCenter(marker.position);
        setHighlightedMarker(marker.position);
        setZoom(15);
        setIsExiting(false);
      }, 300);
    } else {
      setSelectedMarker(marker);
      setCenter(marker.position);
      setHighlightedMarker(marker.position);
      setZoom(15);
    }
    console.log(marker.description);
  }

  function handleMapClick() {
    if (selectedMarker) {
      setIsExiting(true);
      setTimeout(() => {
        setSelectedMarker(null);
        setHighlightedMarker(null);
        setZoom(12);
        setIsExiting(false);
      }, 300);
    }
  }

  function handleSearchSelect(point: PointResponse) {
    setSelectedMarker({
      position: point.location,
      popup: point.name,
      description: point.description,
    });
    setCenter(point.location);
    setHighlightedMarker(point.location);
    setSearchQuery("");
    setZoom(15);
  }

  // 收藏/取消收藏景点
  const handleStarToggle = async (id: number) => {
    if (!localStorage.getItem("token")) {
      toast.error("请先登录");
      return;
    }

    try {
      const spot = allScenicSpot.sights.find((s) => s.id === id);
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

      if (starredSpots.includes(id)) {
        // 取消收藏
        const result = await scenicSpot.deleteStarredScenicSpot(spotData);
        console.log("取消收藏结果:", result);
        setStarredSpots((prev) => prev.filter((spotId) => spotId !== id));
        toast.success("已取消收藏");
      } else {
        // 添加收藏
        const result = await scenicSpot.addStarredScenicSpot(spotData);
        console.log("添加收藏结果:", result);
        setStarredSpots((prev) => [...prev, id]);
        toast.success("已添加到收藏");
      }
    } catch (error) {
      console.error("收藏操作失败:", error);
      toast.error("操作失败，请重试");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-background to-background/95"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl opacity-60"></div>
      </div>

      <MapComponent
        showZoomLevel={true}
        className="w-full h-full rounded-md shadow-xl border border-border/20 z-10"
        center={center}
        zoom={zoom}
        maxZoom={18}
        minZoom={12}
        titleMaxZoom={18}
        titleMinZoom={14}
        markers={points.map((point) => ({
          title: point.name,
          position: point.location,
          popup: point.name,
          description: point.description,
          icon: {
            url:
              highlightedMarker &&
              highlightedMarker[0] === point.location[0] &&
              highlightedMarker[1] === point.location[1]
                ? "/images/location-custom.svg"
                : starredSpots.includes(point.id)
                ? "/images/location-custom-green.svg" // 已收藏景点特殊图标
                : "/images/location.svg",
            size: [32, 32],
            anchor: [16, 16],
          },
        }))}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
      />
      <ControlBar
        className="absolute top-4 right-4 z-60"
        variant="reversalDefault"
      />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col gap-4 absolute bg-background/90 backdrop-blur-md border border-border/30 shadow-lg bottom-6 left-6 p-4 rounded-xl z-999"
      >
        <h3 className="text-sm font-medium mb-1 text-foreground/90">
          地图图例
        </h3>
        <div className="flex items-center text-sm gap-2">
          <div className="p-1 bg-primary/10 rounded-full">
            <img src="/images/location-custom.svg" className="w-4 h-4" alt="" />
          </div>
          <span className="text-foreground/80">焦点景点</span>
        </div>
        <div className="flex items-center text-sm gap-2">
          <div className="p-1 bg-green-500/10 rounded-full">
            <img
              src="/images/location-custom-green.svg"
              className="w-4 h-4"
              alt=""
            />
          </div>
          <span className="text-foreground/80">已收藏景点</span>
        </div>
        <div className="flex items-center text-sm gap-2">
          <div className="p-1 bg-muted/50 rounded-full">
            <img src="/images/location.svg" className="w-4 h-4" alt="" />
          </div>
          <span className="text-foreground/80">存在景点</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-full dark:bg-gradient-to-r dark:from-background/90 dark:to-background/80 bg-gradient-to-r from-primary/90 to-primary/80 text-white flex items-center gap-2 shadow-lg border border-primary/20"
        >
          <Home className="h-4 w-4" />
          <span className="text-sm font-medium">返回首页</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={
          selectedMarker
            ? isExiting
              ? { opacity: 0, x: -300 }
              : { opacity: 1, x: 0 }
            : { opacity: 1, x: 0 }
        }
        transition={{ duration: 0.3 }}
        className="w-[320px] absolute top-4 left-4 z-50 md:w-[320px] sm:w-[calc(100%-32px)] sm:top-4 sm:left-4 md:top-6 md:left-6"
      >
        <motion.div
          className="bg-background/90 backdrop-blur-md rounded-xl shadow-xl border border-border/50 overflow-hidden"
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center px-3 py-3 border-b border-border/20 bg-muted/20">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input
                placeholder="搜索景点..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm bg-background/70 border-0 focus-visible:ring-primary/40 rounded-lg"
              />
            </div>
          </div>

          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              className="max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
            >
              {filteredPoints.length === 0 ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center py-6"
                >
                  <div className="rounded-full bg-muted/50 p-3 mb-3">
                    <Search className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    未找到相关景点
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1.5">
                    请尝试其他关键词
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-1 px-2 py-1">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground/90">
                    搜索结果 ({filteredPoints.length})
                  </div>
                  <div>
                    {filteredPoints.map((point, index) => (
                      <motion.div
                        key={point.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: index * 0.03 }}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start px-2 py-2 h-auto text-left rounded-lg transition-all duration-200 ${
                            index === selectedIndex
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-muted/70 text-foreground"
                          }`}
                          onClick={() => handleSearchSelect(point)}
                        >
                          <div className="flex items-start w-full overflow-hidden">
                            <div className="mr-2 mt-0.5 flex-shrink-0">
                              <MapPin className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="flex flex-col items-start w-full min-w-0">
                              <span className="font-medium text-sm truncate w-full">
                                {point.name}
                              </span>
                              <span className="text-xs text-muted-foreground/80 truncate w-full mt-0.5">
                                {point.description}
                              </span>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-muted-foreground px-3 py-2 border-t border-border/20 mt-1 bg-muted/10">
                <div className="flex items-center space-x-1">
                  <span>提示:</span>
                  <div className="inline-flex items-center border border-border/30 px-1 rounded text-[9px]">
                    ↑↓
                  </div>
                  <span>选择</span>
                  <span>·</span>
                  <div className="inline-flex items-center border border-border/30 px-1 rounded text-[9px]">
                    Enter
                  </div>
                  <span>确认</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {selectedMarker && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="mt-3 bg-background/90 backdrop-blur-md rounded-xl shadow-xl border border-border/50 p-5 overflow-hidden"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base md:text-lg font-semibold truncate pr-2 text-foreground">
                {selectedMarker.popup}
              </h3>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 flex-shrink-0 rounded-full ${
                    points.find(
                      (p) =>
                        p.location[0] === selectedMarker.position[0] &&
                        p.location[1] === selectedMarker.position[1] &&
                        starredSpots.includes(p.id)
                    )
                      ? "text-yellow-500 bg-yellow-500/10"
                      : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"
                  }`}
                  onClick={() => {
                    const point = points.find(
                      (p) =>
                        p.location[0] === selectedMarker.position[0] &&
                        p.location[1] === selectedMarker.position[1]
                    );
                    if (point) {
                      handleStarToggle(point.id);
                    }
                  }}
                >
                  {points.find(
                    (p) =>
                      p.location[0] === selectedMarker.position[0] &&
                      p.location[1] === selectedMarker.position[1] &&
                      starredSpots.includes(p.id)
                  ) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  )}
                </Button>
              </motion.div>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 border border-border/20">
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 overflow-hidden text-ellipsis">
                {selectedMarker.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full relative overflow-hidden group"
                  disabled={isOnGuide}
                  variant={"tw"}
                  onClick={() =>
                    guideScenicSpot(
                      selectedMarker.popup || "",
                      localStorage.getItem("user_id") || ""
                    )
                  }
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg blur-sm"></div>
                  <div className="relative flex items-center justify-center">
                    {isOnGuide ? (
                      <>
                        <div className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                        <span>导游中...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 mr-2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <path d="M12 17h.01" />
                        </svg>
                        <span>AI 导游</span>
                      </>
                    )}
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full relative overflow-hidden group"
                  variant={"tw"}
                  onClick={() => {
                    const point = points.find(
                      (p) =>
                        p.location[0] === selectedMarker.position[0] &&
                        p.location[1] === selectedMarker.position[1]
                    );
                    if (point) {
                      router.push(`/scenicSpot/${point.id}`);
                    }
                  }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg blur-sm"></div>
                  <div className="relative flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <span>查看详情</span>
                  </div>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {guideMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-[3px]"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.4, type: "spring", damping: 20 }}
            className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-background/95 backdrop-blur-xl rounded-xl shadow-2xl border border-primary/20 overflow-hidden"
          >
            <div className="flex items-start justify-between px-5 py-4 border-b border-border/30 bg-muted/20">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex-shrink-0 rounded-full bg-primary/15 p-2.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-primary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-medium truncate">
                    AI 智能导游
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    由人工智能提供专业讲解
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={isPlaying ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => playSpeech(guideMessage)}
                    className="h-9 ml-1 flex-shrink-0 gap-1.5 transition-all duration-200 rounded-full px-3.5"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setGuideMessage("");
                    setIsPlaying(false);
                    playSpeech("");
                  }}
                  className="h-8 w-8 p-0 flex-shrink-0 rounded-full hover:bg-muted/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 prose prose-sm md:prose-base max-w-none scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
              <div className="text-foreground [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mt-5 [&>h2]:mb-3 [&>h3]:text-base [&>h3]:font-medium [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:my-2 [&>p]:leading-relaxed [&>ul]:my-2 [&>ol]:my-2 [&>li]:my-1 [&>li]:ml-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/30 [&>blockquote]:bg-primary/5 [&>blockquote]:pl-4 [&>blockquote]:py-2 [&>blockquote]:my-3 [&>blockquote]:italic [&>blockquote]:rounded-sm [&>code]:bg-muted/70 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-sm [&>code]:text-primary [&>pre]:bg-muted/60 [&>pre]:p-4 [&>pre]:rounded-md [&>pre]:my-3 [&>pre]:overflow-x-auto [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4 [&>a]:hover:text-primary/80 [&>table]:w-full [&>table]:my-4 [&>table]:border-collapse [&>th]:border [&>th]:border-muted [&>th]:p-2 [&>td]:border [&>td]:border-muted [&>td]:p-2 [&>*]:break-words [&>*]:max-w-full">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {guideMessage}
                </ReactMarkdown>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border/30 bg-muted/10">
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full bg-primary/10 px-3 py-1">
                  <span className="text-xs text-primary font-medium">
                    AI 导游模式
                  </span>
                </div>
                {isPlaying && (
                  <div className="flex items-center space-x-1">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="h-1.5 w-1.5 rounded-full bg-primary"
                    ></motion.span>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                      className="h-1.5 w-1.5 rounded-full bg-primary"
                    ></motion.span>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                      className="h-1.5 w-1.5 rounded-full bg-primary"
                    ></motion.span>
                  </div>
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setGuideMessage("");
                    setIsPlaying(false);
                  }}
                  className="h-8 text-xs px-3"
                >
                  关闭导游
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ProcessingPoint(
  ScenicSpotResponse: ScenicSpotResponse
): PointResponse[] {
  const points: PointResponse[] = [];
  ScenicSpotResponse.sights.forEach((sight) => {
    if (sight.localtion) {
      const [lat, lng] = sight.localtion.split(",");
      points.push({
        id: sight.id,
        name: sight.name,
        location: [Number(lng), Number(lat)],
        description: sight.pname + sight.city_name + sight.name + sight.address,
      });
    }
  });
  return points;
}
