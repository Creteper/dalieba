/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-02 11:20:39
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-02 11:34:33
 * @FilePath: \dalieba\app\personal\stars\components\spot-card.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Star, Calendar, Navigation, Bookmark } from "lucide-react";
import { motion } from "motion/react";

export interface SpotCardProps {
  name: string;
  rating: string;
  location: string;
  bestSeason: string;
  imageUrl: string;
  isStarred?: boolean;
  visitors?: string;
}

export default function SpotCard({ 
  name, 
  rating, 
  location, 
  bestSeason, 
  imageUrl, 
  isStarred = true,
  visitors = "1.5k"
}: SpotCardProps) {
  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      {/* 卡片主体 */}
      <div className="h-32 md:h-36 lg:h-40 w-full relative">
        {/* 背景图片 */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        
        {/* 顶部信息，显示收藏状态 */}
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start">
          <div className="px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs flex items-center">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40">
            <Bookmark className={`h-4 w-4 ${isStarred ? "fill-white" : ""}`} />
          </Button>
        </div>

        {/* 底部渐变覆盖和主要信息 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-12">
          <h3 className="font-bold text-white text-base">{name}</h3>
          <div className="flex items-center text-xs text-white/80 mt-1">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        
        {/* 右下角游客数量 */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
          <span>{visitors} 人去过</span>
        </div>
      </div>
      
      {/* 卡片底部操作区 */}
      <div className="p-3 bg-background flex items-center justify-between">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
          <span>{bestSeason}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs flex items-center gap-1 h-7 px-3 rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          查看详情 
          <Navigation className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
} 