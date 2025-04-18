/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-17 15:26:33
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-18 14:48:17
 * @FilePath: \dalieba\app\routeRecommend\[routeId]\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

"use client";

import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ControlBar from "@/components/ui/control-bar";
import { routeData, tripData } from "@/lib/data-static";
import { useState } from "react";
import { RouteData, TripData } from "@/types/article";
import AnalyzeRoute from "@/lib/analyze-route";
import { useEffect } from "react";
import MapComponent, { MapMaker, Route } from "@/components/map/MapComponent";
import { convertToPos } from "@/lib/pos-split";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import React from "react";
import { ServerConfig } from "@/lib/site";

function getRouteName(routeId: string) {
  const route = tripData.find((route) => route.id === parseInt(routeId));
  return route?.title;
}

function getTripData(routeId: string) {
  const route = tripData.find((route) => route.id === parseInt(routeId));
  return route;
}

function getRouteData(routeId: string): RouteData | undefined {
  const route = routeData.find((route) => route.id === parseInt(routeId));
  if (!route) return undefined;
  return route as unknown as RouteData;
}

export default function RouteRecommendPage() {
  const params = useParams();
  const routeId = params.routeId;
  const router = useRouter();
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [analyzeRoute, setAnalyzeRoute] = useState<AnalyzeRoute | null>(null);
  const [markers, setMarkers] = useState<MapMaker[]>([]);
  const [activeDay, setActiveDay] = useState("1");
  const [selectedSpot, setSelectedSpot] = useState<TripData | null>(null);
  const [dayRoutes, setDayRoutes] = useState<Route[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const route = getRouteData(routeId as string);
    if (route) {
      setRouteData(route as unknown as RouteData);
      setAnalyzeRoute(new AnalyzeRoute(route as unknown as RouteData));
    }
  }, [routeId]);

  useEffect(() => {
    if (analyzeRoute) {
      setMarkers(analyzeRoute?.getAllMakers());
    }
  }, [analyzeRoute]);

  useEffect(() => {
    if (analyzeRoute && activeDay) {
      // 获取路线数据
      const fetchRoutes = async () => {
        try {
          setShowAnimation(true);
          const routes = await analyzeRoute.getDayRoutes(parseInt(activeDay));
          setDayRoutes(routes);
          setTimeout(() => setShowAnimation(false), 800);
        } catch (error) {
          console.error("获取路线数据失败:", error);
          setDayRoutes([]);
          setShowAnimation(false);
        }
      };

      fetchRoutes();
    }
  }, [analyzeRoute, activeDay]);

  // 处理地图标记点击
  const handleMarkerClick = (marker: {
    position: [number, number];
    popup?: string;
    description?: string;
    title?: string;
  }) => {
    if (routeData && analyzeRoute) {
      const day = parseInt(activeDay);
      const spot = routeData.spots[day - 1].trip.find(
        (trip) => trip.name === marker.title
      );
      if (spot) {
        setSelectedSpot(null);
        setTimeout(() => setSelectedSpot(spot), 50);
      }
    }
  };

  // 获取路线数据
  const tripDetails = getTripData(routeId as string);

  return (
    <motion.div className="bg-gradient-to-b from-background to-background/95">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center px-5 md:px-20 fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm h-16 border-b border-border"
      >
        <div className="flex items-center gap-4">
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">路线推荐</h1>
        </div>
        <ControlBar className="static" variant="outline" />
      </motion.div>

      {/* content */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-5 md:px-20 mt-20 pb-16"
      >
        {/* 顶部路线信息卡片 */}
        <motion.div
          className="w-full bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md mb-8 border border-border/50"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-primary group flex items-center gap-2">
                <span>{getRouteName(routeId as string)}</span>
                <span className="inline-block group-hover:rotate-[15deg] transition-transform">
                  🧭
                </span>
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
                  {tripDetails?.type === "regular" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                  <span>
                    {tripDetails?.type === "regular" ? "常规路线" : "CityWalk"}
                  </span>
                </div>

                {routeData && (
                  <div className="bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1 text-sm flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{routeData.spots.length} 天行程</span>
                  </div>
                )}

                <div className="bg-blue-500/10 text-blue-500 rounded-full px-3 py-1 text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span>
                    约 {routeData ? routeData.spots.length * 5 : 10} 公里
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground mt-4">
                探索这条精心设计的路线，体验独特的旅行体验。沿途有多个精彩景点等待您的发现。
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center mb-4">
          <div className="relative">
            <h1 className="text-lg font-bold">旅行地图</h1>
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/30 rounded-full"></div>
          </div>
          <div className="h-px bg-border flex-1 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 gap-6 grid-flow-row md:grid-cols-3">
          <Tabs
            defaultValue="1"
            className="w-full md:col-span-2"
            onValueChange={setActiveDay}
          >
            <TabsList className="bg-muted/50 p-1 rounded-lg">
              {routeData?.spots.map((spot) => (
                <TabsTrigger
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
                  key={spot.day}
                  value={spot.day.toString()}
                >
                  Day {spot.day}
                </TabsTrigger>
              ))}
            </TabsList>
            {routeData?.spots.map((spot) => {
              return (
                <TabsContent
                  key={spot.day}
                  value={spot.day.toString()}
                  className="mt-4 animate-in fade-in-50 duration-300"
                >
                  <div className="relative w-full bg-muted/80 h-[300px] md:h-[450px] rounded-xl overflow-hidden shadow-md border border-border/50">
                    {showAnimation && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center">
                          <div className="animate-bounce mb-2 text-2xl">🗺️</div>
                          <p>路线生成中...</p>
                        </div>
                      </div>
                    )}
                    <MapComponent
                      titleMaxZoom={18}
                      titleMinZoom={13}
                      maxZoom={18}
                      minZoom={13}
                      markers={analyzeRoute?.getDayMakers(spot.day)}
                      onMarkerClick={handleMarkerClick}
                      routes={
                        spot.day.toString() === activeDay ? dayRoutes : []
                      }
                    />
                  </div>

                  <motion.div
                    className="mt-4 w-full h-[220px] bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md border border-border/50 transition-all"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {selectedSpot ? (
                      <div className="flex flex-col md:flex-row items-start p-4 h-full">
                        <div className="w-full md:w-1/3 mb-3 md:mb-0 md:mr-4">
                          <div className="rounded-lg overflow-hidden w-full h-32 bg-muted shadow-sm relative group">
                            <motion.img
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              src={
                                ServerConfig.userApiUrl +
                                `/img/` +
                                selectedSpot.name +
                                ".jpg"
                              }
                              alt={selectedSpot.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>
                        <div className="w-full md:w-2/3 flex flex-col h-full overflow-y-auto">
                          <h3 className="font-semibold text-base text-primary group flex items-center">
                            <span>{selectedSpot.name}</span>
                            <span className="ml-2 text-xs px-2 py-0.5 bg-primary/10 rounded-full">
                              #{spot.day}-{selectedSpot.id}
                            </span>
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {selectedSpot.arrivalTime}
                            </span>
                            {selectedSpot.rating && (
                              <span className="flex items-center bg-yellow-500/10 px-2 py-0.5 rounded-full text-xs">
                                <span className="text-yellow-500 mr-1">★</span>
                                {selectedSpot.rating}
                              </span>
                            )}
                            {selectedSpot && (
                              <span className="flex items-center bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full text-xs">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                约 20 分钟
                              </span>
                            )}
                          </div>
                          <p className="text-sm mt-3 text-foreground/80">
                            {selectedSpot.description}
                          </p>
                          <div className="mt-auto pt-2">
                            <p className="text-xs flex items-center text-muted-foreground">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {selectedSpot.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                        <div className="animate-bounce mb-4 text-2xl">👆</div>
                        <p>点击地图上的标记查看景点详情</p>
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
              );
            })}
          </Tabs>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full p-6 bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md border border-border/50 md:h-min"
          >
            <div className="flex items-center mb-4">
              <h1 className="text-lg font-bold text-primary flex items-center">
                <span className="inline-block mr-2">📋</span>
                <span>Day {activeDay} 行程</span>
              </h1>
            </div>

            <Timeline defaultValue={routeData?.spots.length}>
              {routeData?.spots
                .filter((spot) => spot.day.toString() === activeDay)
                .map((spot) => {
                  return (
                    <React.Fragment key={`day-${spot.day}`}>
                      {spot.trip.map((trip, index) => (
                        <TimelineItem
                          key={`trip-${spot.day}-${trip.id}`}
                          step={spot.day}
                          className="group-data-[orientation=vertical]/timeline:ms-10"
                        >
                          <TimelineHeader>
                            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                            <TimelineDate className="mt-0.5 text-xs bg-background/50 rounded-full px-2">
                              {trip.arrivalTime}
                            </TimelineDate>
                            <TimelineTitle className="mt-0.5 font-medium">
                              {trip.name}
                            </TimelineTitle>
                            <TimelineIndicator className="bg-primary/10 text-primary group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                              {index + 1}
                            </TimelineIndicator>
                          </TimelineHeader>
                          <TimelineContent>
                            <motion.div
                              className="p-2 bg-muted/80 rounded-lg shadow-sm hover:bg-muted/90 transition-colors cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 10,
                              }}
                              onClick={() => setSelectedSpot(trip)}
                            >
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {trip.description}
                              </div>
                              <div className="mt-1 flex items-center">
                                <span className="text-xs bg-blue-500/10 text-blue-500 rounded-full px-2 py-0.5 inline-flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                    />
                                  </svg>
                                  行走时间参考
                                </span>
                              </div>
                            </motion.div>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </React.Fragment>
                  );
                })}
            </Timeline>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
