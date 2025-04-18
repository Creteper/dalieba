"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, Route, ArrowRight, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "motion/react";
import ScenicSpot from "@/lib/scenic-spot";
import { cn } from "@/lib/utils";

interface CalcTimeProps {
  type: "taxi" | "bus" | "walk";
  icon: React.ReactNode;
  title: string;
}

interface SearchResult {
  sights: Array<{
    id: number;
    name: string;
    address: string;
    adname: string;
    city_name: string;
    pname: string;
    localtion: string;
  }>;
}

interface Location {
  name: string;
  coordinates: {
    lng: number;
    lat: number;
  };
}

export default function CalcTime({ type, icon, title }: CalcTimeProps) {
  const [start, setStart] = useState<Location | null>(null);
  const [end, setEnd] = useState<Location | null>(null);
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [time, setTime] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [showStartSearch, setShowStartSearch] = useState(false);
  const [showEndSearch, setShowEndSearch] = useState(false);
  const [startResults, setStartResults] = useState<SearchResult["sights"]>([]);
  const [endResults, setEndResults] = useState<SearchResult["sights"]>([]);
  const [calculating, setCalculating] = useState(false);
  const scenicSpot = new ScenicSpot();

  // 计算两点之间的距离（米）
  const calculateDistance = (start: Location, end: Location) => {
    const R = 6371000; // 地球半径（米）
    const dLat = toRad(end.coordinates.lat - start.coordinates.lat);
    const dLon = toRad(end.coordinates.lng - start.coordinates.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(start.coordinates.lat)) *
        Math.cos(toRad(end.coordinates.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number) => {
    return (value * Math.PI) / 180;
  };

  // 计算时间（分钟）
  const calculateTime = (distance: number) => {
    const speeds = {
      taxi: 30, // 出租车平均速度 30km/h
      bus: 20, // 公交车平均速度 20km/h
      walk: 5, // 步行平均速度 5km/h
    };

    const speed = (speeds[type] * 1000) / 60; // 转换为 米/分钟
    return Math.ceil(distance / speed);
  };

  const handleSearch = async (keyword: string, type: "start" | "end") => {
    if (!keyword.trim()) {
      type === "start" ? setStartResults([]) : setEndResults([]);
      return;
    }

    try {
      const results = await scenicSpot.keywordSearch<SearchResult>(keyword);
      type === "start"
        ? setStartResults(results.sights)
        : setEndResults(results.sights);
    } catch (error) {
      console.error("搜索失败:", error);
      type === "start" ? setStartResults([]) : setEndResults([]);
    }
  };

  const handleCalculate = () => {
    if (!start || !end) {
      return;
    }

    setCalculating(true);

    // 模拟计算过程，增加交互感
    setTimeout(() => {
      const distance = calculateDistance(start, end);
      setDistance(distance);
      const time = calculateTime(distance);
      setTime(time);
      setCalculating(false);
    }, 800);
  };

  // 获取交通方式对应的颜色
  const getTypeColor = () => {
    switch (type) {
      case "taxi":
        return "bg-amber-500";
      case "bus":
        return "bg-blue-500";
      case "walk":
        return "bg-green-500";
      default:
        return "bg-primary";
    }
  };

  const getTypeBorderColor = () => {
    switch (type) {
      case "taxi":
        return "border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20";
      case "bus":
        return "border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20";
      case "walk":
        return "border-green-500/50 bg-green-500/10 hover:bg-green-500/20";
      default:
        return "border-primary/50 bg-primary/10 hover:bg-primary/20";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-36 flex flex-col gap-2 transition-all duration-200 shadow-sm group border-2",
            getTypeBorderColor(),
            "hover:shadow-md hover:scale-102"
          )}
        >
          <div
            className={cn(
              "p-3 rounded-full shadow-sm transition-all",
              getTypeColor(),
              "text-white group-hover:scale-110"
            )}
          >
            {icon}
          </div>
          <span className="text-base font-medium group-hover:font-bold transition-all">
            {title}出行
          </span>
          <span className="text-xs text-muted-foreground">点击计算时间</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] shadow-xl">
        <DialogHeader className={cn("pb-4 border-b")}>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span
              className={cn(
                "p-2 rounded-full",
                getTypeColor(),
                "text-white shadow-sm"
              )}
            >
              {icon}
            </span>
            <div className="flex flex-col">
              <span>{title}时间计算</span>
              <span className="text-sm font-normal text-muted-foreground">
                {type === "taxi"
                  ? "出租车路线规划"
                  : type === "bus"
                  ? "公交车路线规划"
                  : "步行路线规划"}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-5">
          <div className="bg-muted/30 p-5 rounded-xl space-y-5 border shadow-sm">
            <div className="space-y-2">
              <Label
                htmlFor={`${type}-start`}
                className="flex items-center gap-2 text-base"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-blue-600" />
                </div>
                起点位置
              </Label>
              <div className="relative">
                <div className="relative">
                  <Input
                    id={`${type}-start`}
                    placeholder="输入起点位置关键词"
                    value={startInput}
                    onChange={(e) => {
                      setStartInput(e.target.value);
                      handleSearch(e.target.value, "start");
                    }}
                    onFocus={() => setShowStartSearch(true)}
                    onBlur={() =>
                      setTimeout(() => setShowStartSearch(false), 200)
                    }
                    className="border pl-10 focus:border-blue-500 shadow-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {showStartSearch && startResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-1 border rounded-md shadow-lg bg-background z-10">
                    <div className="max-h-[200px] overflow-y-auto">
                      {startResults.map((result) => (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={result.id}
                          className="px-3 py-2.5 hover:bg-accent cursor-pointer border-b last:border-b-0"
                          onClick={() => {
                            const [lng, lat] = result.localtion
                              .split(",")
                              .map(Number);
                            setStart({
                              name: result.name,
                              coordinates: { lng, lat },
                            });
                            setStartInput(result.name);
                            setShowStartSearch(false);
                          }}
                        >
                          <div className="font-medium flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-blue-500" />
                            {result.name}
                          </div>
                          <div className="text-xs text-muted-foreground ml-5">
                            {result.pname} {result.city_name} {result.adname}{" "}
                            {result.address}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center">
              <div className="w-8 h-px bg-muted-foreground/30 mx-2"></div>
              <ArrowRight className="text-muted-foreground" />
              <div className="w-8 h-px bg-muted-foreground/30 mx-2"></div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`${type}-end`}
                className="flex items-center gap-2 text-base"
              >
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-red-600" />
                </div>
                终点位置
              </Label>
              <div className="relative">
                <div className="relative">
                  <Input
                    id={`${type}-end`}
                    placeholder="输入终点位置关键词"
                    value={endInput}
                    onChange={(e) => {
                      setEndInput(e.target.value);
                      handleSearch(e.target.value, "end");
                    }}
                    onFocus={() => setShowEndSearch(true)}
                    onBlur={() =>
                      setTimeout(() => setShowEndSearch(false), 200)
                    }
                    className="border pl-10 focus:border-red-500 shadow-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {showEndSearch && endResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-1 border rounded-md shadow-lg bg-background z-10">
                    <div className="max-h-[200px] overflow-y-auto">
                      {endResults.map((result) => (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={result.id}
                          className="px-3 py-2.5 hover:bg-accent cursor-pointer border-b last:border-b-0"
                          onClick={() => {
                            const [lng, lat] = result.localtion
                              .split(",")
                              .map(Number);
                            setEnd({
                              name: result.name,
                              coordinates: { lng, lat },
                            });
                            setEndInput(result.name);
                            setShowEndSearch(false);
                          }}
                        >
                          <div className="font-medium flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-red-500" />
                            {result.name}
                          </div>
                          <div className="text-xs text-muted-foreground ml-5">
                            {result.pname} {result.city_name} {result.adname}{" "}
                            {result.address}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            className={cn(
              "w-full text-base font-medium h-12",
              getTypeColor(),
              "hover:opacity-90 shadow-md"
            )}
            onClick={handleCalculate}
            disabled={!start || !end || calculating}
          >
            {calculating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
                计算中...
              </div>
            ) : (
              <span className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                {start && end ? "开始计算" : "请选择起点和终点"}
              </span>
            )}
          </Button>

          {time !== null && distance !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("p-5 rounded-xl border-2 space-y-4 shadow-sm")}
            >
              <div className="flex items-center bg-muted/30 p-3 rounded-lg">
                <div className="flex-1 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div className="truncate font-medium text-sm">
                    {start?.name}
                  </div>
                </div>
                <ArrowRight className="mx-3 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
                    <MapPin className="h-3.5 w-3.5 text-red-600" />
                  </div>
                  <div className="truncate font-medium text-sm">
                    {end?.name}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-3 border rounded-lg bg-muted/20">
                  <Route className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-sm text-muted-foreground">总距离</span>
                  <span className="text-xl font-bold">
                    {(distance / 1000).toFixed(1)} 公里
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 border rounded-lg bg-muted/20">
                  <Clock className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-sm text-muted-foreground">
                    预计{title}时间
                  </span>
                  <div
                    className={cn(
                      "text-xl font-bold mt-1 px-3 py-1 rounded-md",
                      getTypeColor(),
                      "text-white"
                    )}
                  >
                    {time} 分钟
                  </div>
                </div>
              </div>

              <div className="text-xs text-center text-muted-foreground bg-muted/20 py-2 rounded-lg">
                ※ 实际时间可能因路况、天气等因素有所变化，仅供参考
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
