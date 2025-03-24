/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-22 13:16:50
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-24 10:45:36
 * @FilePath: \dalieba\app\home\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import MapComponent from "@/components/map/MapComponent";
import ControlBar from "@/components/ui/control-bar";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [helloTitle, setHelloTitle] = useState("");
  const isMobile = useIsMobile();
  useEffect(() => {
    setHelloTitle(getTimeState() + "!");

  });
  return (
    <div className="w-full">
      <div className="w-full h-screen">
        <MapComponent
          showZoomLevel={false}
          className="w-full h-screen"
          center={[45.774835, 126.617682]}
        />
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-[300px] h-[170px] absolute top-[70px] left-[10px] z-40"
        ></motion.div>
      </div>
      <motion.div
        className="w-full h-[60px] fixed bg-background/90 top-0 z-50 backdrop-blur-xl border-b-1 border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="w-full h-full flex">
          <div className="flex items-center justify-center gap-2 ml-4">
            <img
              src="/images/logo.svg"
              className="w-8 h-8 object-cover"
              alt="GO! TOGETHER"
            />
            <p className="font-bold text-xl">GO! TOGETHER</p>
          </div>
          <ControlBar variant="outline" className="static ml-auto mr-4" />
        </nav>
      </motion.div>
      <motion.div
        className={cn(
          "w-full top-[250px] absolute bg-background rounded-t-xl h-[3000px] z-40",  
        )}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full h-full">
          <div className="px-10 md:px-20 pb-20">
            <p className="font-bold mt-10 md:mt-12 text-md text-muted-foreground">
              <Typewriter words={[helloTitle]} />
            </p>
            
            {/* 分类导航 */}
            <div className="flex items-center gap-6 mt-6 mb-8 text-sm">
              <button className="font-bold text-primary">推荐</button>
              <button className="hover:text-primary transition-colors">热门</button>
              <button className="hover:text-primary transition-colors">附近</button>
              <button className="hover:text-primary transition-colors">关注</button>
            </div>

            {/* 轮播图区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="aspect-[16/9] h-full bg-muted rounded-xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-muted to-accent/20"></div>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4">
                {Array(2).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[16/9] bg-muted rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                    <div className="w-full h-full bg-gradient-to-br from-muted to-accent/10"></div>
                  </div>
                ))}
                {Array(2).fill(0).map((_, i) => (
                  <div key={i + 2} className="aspect-[16/9] bg-muted rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                    <div className="w-full h-full bg-gradient-to-br from-muted to-accent/10"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* 内容卡片区域 */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[16/10] bg-muted rounded-xl overflow-hidden mb-2 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-gradient-to-br from-muted to-accent/5"></div>
                  </div>
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    推荐内容标题 {i + 1}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>作者名称</span>
                    <span>•</span>
                    <span>2.1万浏览</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function getTimeState() {
  let timeNow = new Date();
  let hours = timeNow.getHours();
  let state = "";

  if (hours >= 0 && hours <= 10) {
    state = "早上好";
  } else if (hours > 10 && hours >= 14) {
    state = "中午好";
  } else if (hours > 14 && hours <= 18) {
    state = "下午好";
  } else if (hours > 18 && hours <= 24) {
    state = "晚上好";
  }
  return state;
}
