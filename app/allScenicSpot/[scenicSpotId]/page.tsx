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
import { motion, PanInfo } from "motion/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import ScenicSpot from "@/lib/scenic-spot";
import {
  ScenicSpotResponse,
  GuideScenicSpotResponse,
  StarredScenicSpotResponse,
} from "@/types/article";
import ControlBar from "@/components/ui/control-bar";
import { Button } from "@/components/ui/button";
import AiChat from "@/lib/ai-chat";
import { toast } from "sonner";
import { Home } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import UserClient from "@/lib/use-client";
import { ServerConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

// 导入子组件
import LanguageSelector from "@/components/scenic-spot/LanguageSelector";
import SearchBox from "@/components/scenic-spot/SearchBox";
import CategoryTabs from "@/components/scenic-spot/CategoryTabs";
import MapLegend from "@/components/scenic-spot/MapLegend";
import ScenicSpotPanel from "@/components/scenic-spot/ScenicSpotPanel";
import GuideDialog from "@/components/scenic-spot/GuideDialog";
import MobileBottomPanel from "@/components/scenic-spot/MobileBottomPanel";

// 导入类型定义
import { PointResponse, SelectedMarker, GuideRecord, CategoryType } from "@/types/scenic-spot";

export default function AllScenicSpotPage() {
  const router = useRouter();
  const params = useParams();
  // 解析ID格式：h_开头为酒店ID，其他为景点ID
  const rawScennicSpotId = params?.scenicSpotId as string;
  const isHotelId = rawScennicSpotId?.startsWith('h_');
  const scenicSpotId = rawScennicSpotId 
    ? (isHotelId ? parseInt(rawScennicSpotId.slice(2)) : parseInt(rawScennicSpotId))
    : null;

  const scenicSpot = new ScenicSpot(); // 景点数据
  const [allScenicSpot, setAllScenicSpot] = useState<ScenicSpotResponse>({
    sights: [],
  }); // 景点数据
  const [points, setPoints] = useState<PointResponse[]>([]); // 景点列表
  const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(null); // 选中的景点
  const [isExiting, setIsExiting] = useState(false); // 是否退出
  const [searchQuery, setSearchQuery] = useState(""); // 搜索框内容
  const [center, setCenter] = useState<[number, number]>([
    39.774835, 116.397029,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOnGuide, setIsOnGuide] = useState(false);
  const [guideMessage, setGuideMessage] = useState("");
  const [guideAudioUrl, setGuideAudioUrl] = useState("");
  const [guideRecords, setGuideRecords] = useState<GuideRecord[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [highlightedMarker, setHighlightedMarker] = useState<
    [number, number] | null
  >(null);
  const [zoom, setZoom] = useState<number>(12);
  const aiChat = new AiChat(); // AI聊天
  const [starredSpots, setStarredSpots] = useState<number[]>([]); // 已收藏的景点ID列表
  const userClient = new UserClient();
  
  // 类别切换相关状态
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('spot'); // 当前类别
  const [allHotel, setAllHotel] = useState<ScenicSpotResponse>({ sights: [] }); // 酒店数据
  
  // 语言选择相关状态
  const [selectedLanguage, setSelectedLanguage] = useState("Chinese"); // 默认中文
  
  // 移动端底部面板相关状态
  const [isMobile, setIsMobile] = useState(false);
  const [panelHeight, setPanelHeight] = useState(200); // 底部面板高度
  const [isDragging, setIsDragging] = useState(false);
  const [minHeight] = useState(80); // 最小高度
  const [maxHeight, setMaxHeight] = useState(400); // 最大高度

  // 移动端检测
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setMaxHeight(window.innerHeight * 0.7);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 清理音频资源
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [currentAudio]);

  // 拖拽处理
  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile) return;
    
    const newHeight = panelHeight - info.delta.y;
    const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
    setPanelHeight(constrainedHeight);
  }, [isMobile, panelHeight, minHeight, maxHeight]);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile) return;
    
    setIsDragging(false);
    const velocity = info.velocity.y;
    
    if (Math.abs(velocity) > 500) {
      // 根据速度自动展开或收起
      if (velocity > 0) {
        setPanelHeight(minHeight);
      } else {
        setPanelHeight(maxHeight);
      }
    } else {
      // 根据当前高度决定
      const threshold = (maxHeight + minHeight) / 2;
      if (panelHeight < threshold) {
        setPanelHeight(minHeight);
      } else {
        setPanelHeight(maxHeight * 0.6);
      }
    }
  }, [isMobile, panelHeight, minHeight, maxHeight]);

  // 模糊搜索过滤
  const filteredPoints = useMemo(() => {
    if (!searchQuery) return points;
    return points.filter((point) =>
      point.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [points, searchQuery]);

  // 播放音频
  const playAudio = (audioUrl: string) => {
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      return;
    }

    const serverConfig = ServerConfig;

    // 拼接完整的音频URL
    const baseUrl = serverConfig.AiApiUrl || '';
    const fullAudioUrl = baseUrl + audioUrl;
    console.log(fullAudioUrl)
    const audio = new Audio(fullAudioUrl);
    
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    };

    audio.onerror = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
      toast.error("音频播放失败");
    };

    audio.play().then(() => {
      setCurrentAudio(audio);
      setIsPlaying(true);
    }).catch((error) => {
      console.error("音频播放错误:", error);
      toast.error("音频播放失败");
    });
  };

  // AI 导游
  async function guideScenicSpot(scenicSpot: string, user_id: string) {
    if (!scenicSpot || !user_id) {
      toast.error("请先登录");
      return;
    }

    // 构建带语言参数的请求内容
    const requestContent = selectedLanguage === "Chinese" 
      ? scenicSpot 
      : `${scenicSpot}_全文使用${selectedLanguage}回复`;

    // 检查是否已经导游过（包含语言参数的缓存key）
    const cacheKey = `${scenicSpot}_${selectedLanguage}`;
    const existingRecord = guideRecords.find(
      (record) => record.scenicSpot === cacheKey
    );
    if (existingRecord) {
      setGuideMessage(existingRecord.message);
      if (existingRecord.audioUrl) {
        setGuideAudioUrl(existingRecord.audioUrl);
        // 自动播放历史音频内容
        setTimeout(() => playAudio(existingRecord.audioUrl!), 500);
      }
      return;
    }

    setIsOnGuide(true);
    try {
      const res: GuideScenicSpotResponse =
        await aiChat.guideScenicSpot<GuideScenicSpotResponse>(
          requestContent,
          user_id
        );
      if (res.status === 200 && res.data.tts_status === "success") {
        toast.success("导游成功");
        setGuideMessage(res.data.text);
        setGuideAudioUrl(res.data.audio.url);
        setGuideRecords((prev) => [...prev, { 
          scenicSpot: cacheKey, 
          message: res.data.text,
          audioUrl: res.data.audio.url
        }]);
        // 自动播放新音频内容
        setTimeout(() => playAudio(res.data.audio.url), 500);
      } else {
        toast.error("导游失败，请重试" + (res.message || ""));
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

  // 根据URL参数设置默认类别
  useEffect(() => {
    if (isHotelId) {
      setCurrentCategory('hotel');
    } else {
      setCurrentCategory('spot');
    }
  }, [isHotelId]);

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

  // 获取所有景点和酒店数据
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
        const allScenicSpotData =
          await scenicSpot.getAllScenicSpot<ScenicSpotResponse>();
        setAllScenicSpot(allScenicSpotData);

        // 获取所有酒店
        const allHotelData =
          await scenicSpot.getAllHotel<ScenicSpotResponse>();
        setAllHotel(allHotelData);

        // 根据URL中的ID类型决定使用哪个数据源
        const dataToUse = isHotelId ? allHotelData : allScenicSpotData;
        const points = ProcessingPoint(dataToUse);
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
            console.log("已收藏ID:", ids);
          } else {
            console.error("收藏数据格式错误:", starredData);
          }
        }
      } catch (error) {
        console.error("获取数据失败", error);
      }
    }

    fetchData();
  }, [isHotelId]);

  // 处理类别切换
  useEffect(() => {
    if (allScenicSpot.sights.length > 0 || allHotel.sights.length > 0) {
      const dataToUse = currentCategory === 'hotel' ? allHotel : allScenicSpot;
      const points = ProcessingPoint(dataToUse);
      setPoints(points);
      
      // 清除当前选中的标记
      setSelectedMarker(null);
      setHighlightedMarker(null);
      setZoom(12);
    }
  }, [currentCategory, allScenicSpot, allHotel]);

  function handleMarkerClick(marker: SelectedMarker) {
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
        user_id: null,
        gd_id: spot.id,
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

  // 关闭导游对话框
  const handleGuideClose = () => {
    setGuideMessage("");
    setGuideAudioUrl("");
    setIsPlaying(false);
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-background to-background/9 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl opacity-60"></div>
      </div>
      <MapComponent 
        showZoomLevel
        className="w-full h-full rounded-md shadow-xl border border-border/20 z-10"
        center={center}
        zoom={zoom}
        maxZoom={18}
        minZoom={4}
        titleMaxZoom={18}
        titleMinZoom={16}
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
                ? "/images/location-custom-green.svg" // 已收藏特殊图标
                : currentCategory === 'hotel' 
                ? "/images/location.svg" // 酒店使用默认图标
                : "/images/location.svg",
            size: [32, 32],
            anchor: [16, 16],
          },
        }))}
        onMapClick={handleMapClick}
        onMarkerClick={handleMarkerClick}
      /> 
      {/* <MapComponent
        showZoomLevel
        className="w-full h-full rounded-md shadow-xl border border-border/20 z-10"
        center={center}
        zoom={zoom}
        maxZoom={18}
        minZoom={4}
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
                ? "/images/location-custom-green.svg" // 已收藏特殊图标
                : currentCategory === 'hotel' 
                ? "/images/location.svg" // 酒店使用默认图标
                : "/images/location.svg",
            size: [32, 32],
            anchor: [16, 16],
          },
        }))}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
      />  */}
      {/* <MapComponent
        showZoomLevel={true}
        className="w-full h-full rounded-md shadow-xl border border-border/20 z-10"
        center={center}
        zoom={zoom}
        maxZoom={18}
        minZoom={4}
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
                ? "/images/location-custom-green.svg" // 已收藏特殊图标
                : currentCategory === 'hotel'
                ? "/images/location.svg" // 酒店使用默认图标
                : "/images/location.svg",
            size: [32, 32],
            anchor: [16, 16],
          },
        }))}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
      /> */}
      
      <ControlBar
        className="absolute top-4 right-4 z-60"
        variant="reversalDefault"
      />

      <MapLegend
        currentCategory={currentCategory}
        className={cn("absolute z-[20]", isMobile ? "bottom-24 left-6" : "bottom-6 left-6")}
      />

      {/* PC端返回按钮 */}
      {!isMobile && (
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
      )}

      {/* PC端左侧面板 */}
      {!isMobile && (
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
          {/* 类别切换和搜索 */}
          <div className="px-3 py-3 border-b border-border/20 bg-muted/20">
            {/* 类别切换按钮 */}
            <div className="mb-3">
              <CategoryTabs
                currentCategory={currentCategory}
                onCategoryChange={setCurrentCategory}
                className=""
              />
            </div>
            
            {/* 语言切换下拉菜单 */}
            <div className="mb-3">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                className=""
              />
            </div>
            
            {/* 搜索框 */}
            <SearchBox
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filteredPoints={filteredPoints}
              selectedIndex={selectedIndex}
              onPointSelect={handleSearchSelect}
              currentCategory={currentCategory}
              className=""
            />
          </div>
        </motion.div>

        {selectedMarker && (
          <ScenicSpotPanel
            selectedMarker={selectedMarker}
            points={points}
            starredSpots={starredSpots}
            currentCategory={currentCategory}
            isOnGuide={isOnGuide}
            onStarToggle={handleStarToggle}
            onGuideClick={guideScenicSpot}
            className=""
          />
        )}
      </motion.div>
      )}

      {/* AI导游对话框 */}
      <GuideDialog
        guideMessage={guideMessage}
        guideAudioUrl={guideAudioUrl}
        selectedLanguage={selectedLanguage}
        isPlaying={isPlaying}
        onClose={handleGuideClose}
        onPlayAudio={playAudio}
      />

      {/* 移动端底部面板 */}
      {isMobile && (
        <MobileBottomPanel
          panelHeight={panelHeight}
          isDragging={isDragging}
          currentCategory={currentCategory}
          selectedLanguage={selectedLanguage}
          searchQuery={searchQuery}
          filteredPoints={filteredPoints}
          selectedIndex={selectedIndex}
          selectedMarker={selectedMarker}
          points={points}
          starredSpots={starredSpots}
          isOnGuide={isOnGuide}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onCategoryChange={setCurrentCategory}
          onLanguageChange={setSelectedLanguage}
          onSearchChange={setSearchQuery}
          onPointSelect={handleSearchSelect}
          onStarToggle={handleStarToggle}
          onGuideClick={guideScenicSpot}
          onDragStart={() => setIsDragging(true)}
        />
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