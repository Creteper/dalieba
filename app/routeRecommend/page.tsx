/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-16 19:50:08
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-17 15:36:12
 * @FilePath: \dalieba\app\routeRecommend\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import ControlBar from "@/components/ui/control-bar";
import { useRouter } from "next/navigation";
import TripCard, {
  TripCardType,
} from "@/components/home/componentsHome/tripCard";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tripData } from "@/lib/data-static";

export default function RouteRecommendPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 确保在客户端渲染后再执行
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTripCardClick = (item: TripCardType) => {
    console.log("点击了", item);
    // 这里可以跳转到详情页面
    router.push(`/routeRecommend/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 顶部导航栏 */}
      <header className="w-full bg-background border-border border-b fixed top-0 left-0 z-10">
        <div className="container max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">路线推荐</h1>
          </div>
          <ControlBar className="static" variant="outline" />
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container max-w-7xl mx-auto pt-24 pb-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            精选<span className="text-primary">路线</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            根据您的兴趣和偏好，为您推荐最适合的路线
          </p>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="cityWalk">City Walk</TabsTrigger>
            <TabsTrigger value="regular">常规路线</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tripData.map((trip) => (
                <TripCard
                  onClick={() => handleTripCardClick(trip)}
                  key={trip.id}
                  {...trip}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="cityWalk">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tripData.map(
                (trip) =>
                  trip.type === "cityWalk" && (
                    <TripCard
                      onClick={() => handleTripCardClick(trip)}
                      key={trip.id}
                      {...trip}
                    />
                  )
              )}
            </div>
          </TabsContent>
          <TabsContent value="regular">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tripData.map(
                (trip) =>
                  trip.type === "regular" && (
                    <TripCard
                      onClick={() => handleTripCardClick(trip)}
                      key={trip.id}
                      {...trip}
                    />
                  )
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* 提示信息 */}
        <div className="mt-12 p-4 rounded-lg bg-muted/30 border">
          <p className="text-sm text-muted-foreground">
            以上路线仅供参考，您可以根据个人喜好和实际情况进行调整。点击路线卡片查看详细信息和行程安排。
          </p>
        </div>
      </main>
    </div>
  );
}
