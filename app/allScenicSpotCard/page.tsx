"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import ControlBar from "@/components/ui/control-bar";
import ScenicSpot from "@/lib/scenic-spot";
import { ScenicSpotResponse, StarredScenicSpotResponse } from "@/types/article";
import SpotCard from "@/components/home/componentsHome/spot-card";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  ArrowLeft,
  ChevronUp,
  SearchIcon,
  FilterIcon,
  MapPinIcon,
  X,
} from "lucide-react";
import { ReplaceParentheses } from "@/lib/scenic-spot";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import UserClient from "@/lib/use-client";
import { ServerConfig } from "@/lib/site";
// 每页加载的景点数量
const ITEMS_PER_PAGE = 30;

export default function AllScenicSpotCardPage() {
  const router = useRouter();
  const scenicSpot = new ScenicSpot();
  const [allScenicSpot, setAllScenicSpot] = useState<ScenicSpotResponse>({
    sights: [],
  });
  const [allHotel, setAllHotel] = useState<ScenicSpotResponse>({
    sights: [],
  });
  const [displayedSpots, setDisplayedSpots] = useState<
    ScenicSpotResponse["sights"]
  >([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [starredIds, setStarredIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpots, setFilteredSpots] = useState<
    ScenicSpotResponse["sights"]
  >([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const observerTarget = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const userClient = new UserClient();
  // 获取所有景点数据
  useEffect(() => {
    const checkToken = async () => {
      const isValid = await userClient.verifyToken();
      if (!isValid) {
        // 如果token无效， 跳转登录页
        router.push("/login");
      }
    };

    checkToken();

    async function fetchAllHotel() {
      const data = await scenicSpot.getAllHotel<ScenicSpotResponse>();
      if (data?.sights) {
        setAllHotel(data);
      }
    }

    // 获取所有景点数据
    async function fetchScenicSpots() {
      try {
        const data = await scenicSpot.getAllScenicSpot<ScenicSpotResponse>();
        if (data?.sights) {
          setAllScenicSpot(data);

          // 提取区域分类
          const uniqueDistricts = Array.from(
            new Set(data.sights.map((spot) => spot.adname).filter(Boolean))
          );
          setDistricts(uniqueDistricts);

          // 提取城市分类
          const uniqueCities = Array.from(
            new Set(data.sights.map((spot) => spot.pname).filter(Boolean))
          );
          setCities(uniqueCities);

          setFilteredSpots(data.sights);
          setDisplayedSpots(data.sights.slice(0, ITEMS_PER_PAGE));
          setHasMore(data.sights.length > ITEMS_PER_PAGE);

          // 获取收藏状态
          if (localStorage.getItem("token")) {
            fetchStarredSpots();
          }
        }
      } catch (error) {
        console.error("获取景点数据失败", error);
        toast.error("获取景点数据失败");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllHotel();
    fetchScenicSpots();
  }, []);

  // 监听滚动事件，显示/隐藏回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 获取已收藏的景点
  const fetchStarredSpots = async () => {
    try {
      const starredData = await scenicSpot.getStarredScenicSpot<{
        book_mark: any[];
      }>();
      if (
        starredData &&
        starredData.book_mark &&
        Array.isArray(starredData.book_mark)
      ) {
        const ids = starredData.book_mark.map((item) => item.gd_id);
        setStarredIds(ids);
      }
    } catch (error) {
      console.error("获取收藏景点失败", error);
    }
  };

  // 应用筛选
  useEffect(() => {
    let results =
      activeTab === "hotel" ? allHotel.sights : allScenicSpot.sights;

    // 应用搜索筛选
    if (searchQuery.trim() !== "") {
      results = results.filter(
        (spot) =>
          spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spot.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 应用标签筛选
    if (activeTab === "starred") {
      results = results.filter((spot) => starredIds.includes(spot.id));
    }

    // 应用区域筛选
    if (selectedDistrict) {
      results = results.filter((spot) => spot.adname === selectedDistrict);
    }

    // 应用城市筛选
    if (selectedCity) {
      results = results.filter((spot) => spot.pname === selectedCity);
    }

    setFilteredSpots(results);
    setDisplayedSpots(results.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(results.length > ITEMS_PER_PAGE);
  }, [
    searchQuery,
    allScenicSpot.sights,
    allHotel.sights,
    activeTab,
    starredIds,
    selectedDistrict,
    selectedCity,
  ]);

  // 处理标签切换
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 重置其他筛选条件
    setSelectedDistrict(null);
    setSelectedCity(null);
  };

  // 加载更多数据
  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;

    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    setDisplayedSpots((prev) => [
      ...prev,
      ...filteredSpots.slice(startIndex, endIndex),
    ]);

    setPage(nextPage);
    setHasMore(endIndex < filteredSpots.length);
  }, [filteredSpots, hasMore, isLoading, page]);

  // 设置无限滚动观察器
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore]);

  // 处理收藏/取消收藏
  const handleStarToggle = async (id: number) => {
    if (!localStorage.getItem("token")) {
      toast.error("请先登录");
      router.push("/login");
      return;
    }

    try {
      // 找到对应的景点数据
      const spot = allScenicSpot.sights.find((s) => s.id === id);
      if (!spot) {
        toast.error("景点数据不存在");
        return;
      }

      const spotData: StarredScenicSpotResponse = {
        id: spot.id,
        user_id: null,
        gd_id: null,
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

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 处理景点卡片点击
  const handleSpotClick = (id: number) => {
    // 验证ID是否有效
    if (!id || isNaN(id)) {
      toast.error("ID无效，无法跳转");
      console.error("Invalid id:", id);
      return;
    }
    
    // 根据当前tab类型决定跳转路径和参数
    if (activeTab === "hotel") {
      console.log("跳转到酒店详情页，ID:", id);
      router.push(`/scenicSpot/${id}/hotel`);
    } else {
      console.log("跳转到景点详情页，ID:", id);
      router.push(`/scenicSpot/${id}/spot`);
    }
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">加载景点数据...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background pb-20"
    >
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">
              全国{activeTab === "hotel" ? "酒店" : "景点"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowSearch(!showSearch)}
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`relative ${showFilter ? "bg-accent" : ""}`}
              onClick={() => setShowFilter(!showFilter)}
            >
              <FilterIcon className="h-5 w-5" />
            </Button>
            <ControlBar variant="outline" className="static" />
          </div>
        </div>

        {/* 搜索框 */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="container mx-auto px-4 pb-4 pt-2 overflow-hidden"
            >
              <Command className="w-full border rounded-lg overflow-hidden">
                <CommandInput
                  placeholder={`搜索${
                    activeTab === "hotel" ? "酒店" : "景点"
                  }...`}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="h-10 shadow-none!"
                />
                {searchQuery && (
                  <div className="max-h-[200px] overflow-y-auto">
                    <CommandEmpty className="py-2 text-sm text-muted-foreground">
                      未找到相关{activeTab === "hotel" ? "酒店" : "景点"}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredSpots.slice(0, 5).map((spot) => (
                        <CommandItem
                          key={spot.id}
                          onSelect={() => {
                            setSearchQuery("");
                            handleSpotClick(spot.id);
                          }}
                          className="h-10 text-sm md:text-base px-3"
                        >
                          {spot.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </div>
                )}
              </Command>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 筛选栏 */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="container mx-auto px-4 pb-4 pt-2 overflow-hidden"
            >
              <div className="bg-background/80 border rounded-lg p-3 space-y-4">
                {/* 城市筛选 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">按城市筛选</h3>
                    {selectedCity && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setSelectedCity(null)}
                      >
                        清除 <X className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cities.map((city) => (
                      <Badge
                        key={city}
                        variant={
                          selectedCity === city ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedCity(
                            selectedCity === city ? null : city
                          )
                        }
                      >
                        {city}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 区域筛选 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">按区域筛选</h3>
                    {selectedDistrict && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setSelectedDistrict(null)}
                      >
                        清除 <X className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {districts.map((district) => (
                      <Badge
                        key={district}
                        variant={
                          selectedDistrict === district ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedDistrict(
                            selectedDistrict === district ? null : district
                          )
                        }
                      >
                        {district}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 页面标题区域 */}
      <div className="relative bg-gradient-to-r py-6 mb-2">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            探索全国景点
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {activeTab === "hotel"
              ? "寻找全国优质的酒店住宿，为您的旅行提供舒适的休息场所。"
              : "发现全国最受欢迎的旅游胜地，从历史地标到自然景观，这里有各种各样的景点等待您的探索。"}
          </p>

          <div className="mt-4">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="all" className="text-sm">
                  全部景点
                </TabsTrigger>
                <TabsTrigger value="hotel" className="text-sm">
                  全部酒店
                </TabsTrigger>
                <TabsTrigger value="starred" className="text-sm">
                  我的收藏
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mt-4 flex items-center text-sm">
            <MapPinIcon className="h-4 w-4 mr-1 text-primary" />
            <span>
              共 {filteredSpots.length} 个
              {activeTab === "hotel"
                ? "酒店"
                : activeTab === "starred"
                ? "收藏"
                : "景点"}
            </span>
            {selectedCity && (
              <Badge variant="outline" className="ml-2">
                {selectedCity}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setSelectedCity(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {selectedDistrict && (
              <Badge variant="outline" className="ml-2">
                {selectedDistrict}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setSelectedDistrict(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* 景点列表 */}
      <div className="container mx-auto px-4 py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectedDistrict}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {displayedSpots.map((spot, index) => (
              <motion.div
                key={spot.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(0.05 * (index % 8), 0.4),
                }}
                className="h-full"
              >
                <SpotCard
                  id={spot.id}
                  name={spot.name || `景点${index + 1}`}
                  rating={(4.5 - Math.random() * 0.5).toFixed(1)}
                  description={spot.address || "全国景点"}
                  imageUrl={
                    ServerConfig.userApiUrl +
                    "/img/" +
                    ReplaceParentheses(spot.name) +
                    ".jpg"
                  }
                  isStarred={starredIds.includes(spot.id)}
                  onStarClick={(id) => handleStarToggle(id)}
                  onClick={() => handleSpotClick(spot.id)}
                  className="h-full hover:shadow-md transition-all duration-300"
                  location={spot.adname}
                  bestSeason="四季皆宜"
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* 加载更多指示器 */}
        {hasMore && (
          <div
            ref={observerTarget}
            className="w-full py-8 flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* 没有更多数据 */}
        {!hasMore && displayedSpots.length > 0 && (
          <div className="w-full py-8 text-center text-muted-foreground">
            没有更多景点了
          </div>
        )}

        {/* 空状态 */}
        {displayedSpots.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full py-16 flex flex-col items-center justify-center"
          >
            <div className="bg-muted/50 rounded-full p-4 mb-4">
              <MapPinIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium mb-2">
              未找到相关
              {activeTab === "hotel"
                ? "酒店"
                : activeTab === "starred"
                ? "收藏"
                : "景点"}
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              尝试调整您的筛选条件
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDistrict(null);
                  setSelectedCity(null);
                  setActiveTab("all");
                }}
              >
                清除所有筛选
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </motion.div>
  );
}
