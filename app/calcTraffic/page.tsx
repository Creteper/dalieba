/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-16 18:23:49
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-17 14:53:18
 * @FilePath: \dalieba\app\calcTraffic\page.tsx
 * @Description: 用于计算出行时间
 */
"use client";

import { motion } from "motion/react";
import CalcTime from "@/components/home/componentsHome/calc-time";
import {
  Car,
  Bus,
  Footprints,
  MapPin,
  Navigation,
  Route,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ControlBar from "@/components/ui/control-bar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CalcTrafficPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center w-full">
      {/* 顶部导航栏 */}
      <header className="w-full h-16 fixed top-0 bg-background/90 backdrop-blur-sm shadow-sm z-50 flex justify-center">
        <div className="container max-w-7xl px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <img src="/images/logo.svg" alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold">GO! TOGETHER</h1>
          </div>
          <ControlBar variant="outline" className="static" />
        </div>
      </header>

      <main className="container max-w-7xl w-full px-4 mx-auto pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">交通出行时间计算</h1>
              <p className="text-muted-foreground mt-2">
                根据不同交通方式，精确计算两地之间的出行时间
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">为您提供更精确的时间规划</span>
            </div>
          </div>
          {/* 时间计算器 */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-3xl mx-auto bg-muted/30 rounded-xl p-8 border shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-center">
                出行时间计算器
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>

          {/* 提示信息 */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="border rounded-lg p-4 bg-muted/20">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                出行提示
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  打车出行适合不熟悉路线、行李较多或时间紧张的情况
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  公交出行经济环保，高峰期可能会受交通拥堵影响
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  步行出行适合短距离或景点间徒步游览，可欣赏沿途风景
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  计算结果仅供参考，实际出行时间可能因天气、交通等因素有所变化
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
