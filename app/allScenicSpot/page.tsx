/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-10 10:15:44
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-11 10:09:38
 * @FilePath: \dalieba\app\allScenicSpot\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

"use client";

import MapComponent from "@/components/map/MapComponent";
import { motion } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import ScenicSpot from "@/lib/scenic-spot";
import { ScenicSpotResponse, GuideScenicSpotResponse } from "@/types/article";
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useRouter } from "next/navigation";

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
  const [center, setCenter] = useState<[number, number]>([45.774835, 126.617682]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOnGuide, setIsOnGuide] = useState(false);
  const [guideMessage, setGuideMessage] = useState("");
  const [guideRecords, setGuideRecords] = useState<GuideRecord[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [highlightedMarker, setHighlightedMarker] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState<number>(12);
  const aiChat = new AiChat(); // AI聊天
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

  // AI 导游
  async function guideScenicSpot(scenicSpot: string, user_id: string) {
    if (!scenicSpot || !user_id) {
      toast.error("请先登录");
      return;
    }

    // 检查是否已经导游过
    const existingRecord = guideRecords.find(record => record.scenicSpot === scenicSpot);
    if (existingRecord) {
      setGuideMessage(existingRecord.message);
      // 自动播放历史导游内容
      setTimeout(() => playSpeech(existingRecord.message), 500);
      return;
    }

    setIsOnGuide(true);
    try {
      const res: GuideScenicSpotResponse = await aiChat.guideScenicSpot<GuideScenicSpotResponse>(scenicSpot, user_id);
      if (res.status === 200) {
        toast.success("导游成功");
        setGuideMessage(res.data);
        setGuideRecords(prev => [...prev, { scenicSpot, message: res.data }]);
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

  useEffect(() => {
    async function getScenicSpot() {
      const allScenicSpot =
        await scenicSpot.getAllScenicSpot<ScenicSpotResponse>();
      setAllScenicSpot(allScenicSpot);

      const points = ProcessingPoint(allScenicSpot);
      setPoints(points);
    }
    getScenicSpot();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen flex flex-col items-center justify-center relative"
    >
      <MapComponent
        showZoomLevel={true}
        className="w-full h-full rounded-md shadow-md"
        center={center}
        zoom={zoom}
        maxZoom={17}
        minZoom={13}
        markers={points.map((point) => ({
          position: point.location,
          popup: point.name,
          description: point.description,
          icon: {
            url: highlightedMarker && 
                 highlightedMarker[0] === point.location[0] && 
                 highlightedMarker[1] === point.location[1] 
              ? "/images/location-custom.svg" 
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
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/")}
        className="absolute top-16 right-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white flex items-center gap-2 z-50"
      >
        <Home className="h-5 w-5" />
        <span className="text-sm font-medium">返回主页</span>
      </motion.button>
      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={selectedMarker ? (isExiting ? { opacity: 0, x: -300 } : { opacity: 1, x: 0 }) : { opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[300px] absolute top-4 left-4 z-50 md:w-[300px] sm:w-[calc(100%-32px)] sm:top-4 sm:left-4 md:top-6 md:left-6"
      >
        <Command className="bg-background/80 backdrop-blur-md rounded-lg shadow-lg border border-border/50">
          <CommandInput 
            placeholder="搜索景点..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="text-sm md:text-base h-10"
          />
          {searchQuery && (
            <div className="max-h-[200px] overflow-y-auto border-t border-border/50">
              <CommandEmpty className="py-2 text-sm text-muted-foreground">未找到相关景点</CommandEmpty>
              <CommandGroup>
                {filteredPoints.map((point, index) => (
                  <CommandItem
                    key={point.id}
                    onSelect={() => handleSearchSelect(point)}
                    className={`h-10 text-sm md:text-base px-3 ${index === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                  >
                    {point.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          )}
        </Command>
        {selectedMarker && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 bg-background/80 backdrop-blur-md rounded-lg shadow-lg border border-border/50 p-4"
          >
            <h3 className="text-base md:text-lg font-medium">{selectedMarker.popup}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 line-clamp-2">{selectedMarker.description}</p>
            <Button
              className="mt-3 w-full"
              disabled={isOnGuide}
              variant={"tw"}
              onClick={() => guideScenicSpot(selectedMarker.popup || "", localStorage.getItem("user_id") || "")}
            >
              {isOnGuide ? "导游中..." : "AI 导游"}
            </Button>
          </motion.div>
        )}
      </motion.div>

      {guideMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center p-4 sm:p-6"
        >
          <div className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-background/80 backdrop-blur-md rounded-lg shadow-lg border border-border/50">
            <div className="flex items-start justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-medium">AI 导游</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playSpeech(guideMessage)}
                  className="h-8 w-8 p-0"
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
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 prose prose-sm md:prose-base prose-invert max-w-none">
              <div className="text-muted-foreground [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mt-5 [&>h2]:mb-3 [&>h3]:text-base [&>h3]:font-medium [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:my-2 [&>ul]:my-2 [&>ol]:my-2 [&>li]:my-1 [&>blockquote]:border-l-4 [&>blockquote]:border-muted [&>blockquote]:pl-4 [&>blockquote]:my-2 [&>blockquote]:italic [&>code]:bg-muted/50 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>pre]:bg-muted/50 [&>pre]:p-3 [&>pre]:rounded [&>pre]:my-2 [&>pre]:overflow-x-auto [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4 [&>a]:hover:text-primary/80 [&>table]:w-full [&>table]:my-4 [&>table]:border-collapse [&>th]:border [&>th]:border-muted [&>th]:p-2 [&>td]:border [&>td]:border-muted [&>td]:p-2">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {guideMessage}
                </ReactMarkdown>
              </div>
            </div>
          </div>
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
