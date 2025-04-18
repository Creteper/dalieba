/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-02 15:39:27
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-17 15:36:37
 * @FilePath: \dalieba\components\home\componentsHome\spot-card.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { cn } from "@/lib/utils";
import { MapPin, Star, Clock, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

interface SpotCardProps {
  id?: number;
  name: string;
  rating: string;
  description: string;
  imageUrl: string;
  location?: string;
  bestSeason?: string;
  isStarred?: boolean;
  className?: string;
  onStarClick?: (id: number) => void;
  onClick?: () => void;
  showStar?: boolean;
}

// 使用静态版本作为 SSR 和初始渲染版本
function StaticSpotCard({
  id,
  name,
  rating,
  description,
  imageUrl,
  location,
  bestSeason,
  isStarred = false,
  className,
  onStarClick,
  onClick,
  showStar = true,
}: SpotCardProps) {
  // 评分星星显示
  const ratingNum = parseFloat(rating);
  const fullStars = Math.floor(ratingNum);
  const hasHalfStar = ratingNum % 1 >= 0.5;

  return (
    <div
      className={cn(
        "group flex-shrink-0 md:w-auto rounded-xl shadow-md overflow-hidden snap-start cursor-pointer border border-transparent hover:border-primary/20 transition-all duration-300",
        "bg-background", // 静态默认为亮色主题
        className
      )}
      onClick={onClick}
    >
      <div className="h-44 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-50 transition-opacity" />

        {/* 收藏按钮 */}
        <div className="absolute top-2 right-2 z-10">
          {showStar && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/70",
                isStarred && "text-yellow-500 hover:text-yellow-600"
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (id && onStarClick) onStarClick(id);
              }}
            >
              {showStar && (
                <Star
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isStarred ? "fill-current" : "fill-none"
                  )}
                />
              )}
            </Button>
          )}
        </div>

        {/* 评分显示 */}
        <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs font-medium flex items-center">
          <div className="flex mr-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-sm">
                {i < fullStars ? (
                  <span className="text-yellow-400">★</span>
                ) : i === fullStars && hasHalfStar ? (
                  <span className="text-yellow-400">⯨</span>
                ) : (
                  <span className="text-gray-400">☆</span>
                )}
              </span>
            ))}
          </div>
          <span>{rating}</span>
        </div>

        {/* 位置标签 */}
        {location && (
          <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs font-medium flex items-center">
            <MapPin className="w-3 h-3 inline mr-1" />
            <span className="inline-block max-w-[100px] truncate">
              {location}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* 景点名称 */}
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors truncate">
          {name}
        </h3>

        {/* 描述信息 */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {/* 最佳季节 */}
        {bestSeason && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            <span>最佳季节: {bestSeason}</span>
          </div>
        )}

        {/* 查看详情按钮 */}
        <div className="mt-3 text-sm font-medium text-primary flex items-center">
          <Info className="w-3 h-3 mr-1" />
          查看详情
          <span className="ml-1">→</span>
        </div>
      </div>
    </div>
  );
}

// 动态导入客户端增强版本，确保它只在客户端运行
const AnimatedSpotCard = dynamic(
  () =>
    Promise.resolve(
      ({
        id,
        name,
        rating,
        description,
        imageUrl,
        location,
        bestSeason,
        isStarred = false,
        className,
        onStarClick,
        onClick,
        showStar = true,
      }: SpotCardProps) => {
        const [isHovered, setIsHovered] = useState(false);
        const { theme } = useTheme();

        // 评分星星显示
        const ratingNum = parseFloat(rating);
        const fullStars = Math.floor(ratingNum);
        const hasHalfStar = ratingNum % 1 >= 0.5;

        return (
          <motion.div
            className={cn(
              "group flex-shrink-0 min-w-[220px] md:w-auto rounded-xl shadow-md overflow-hidden snap-start cursor-pointer border border-transparent hover:border-primary/20 transition-all duration-300",
              theme === "dark" ? "bg-muted/30" : "bg-background",
              className
            )}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{
              y: -5,
              boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
              scale: 1.02,
            }}
          >
            <div className="h-44 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
                animate={{
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.4 }}
              />

              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-50 group-hover:opacity-60 transition-opacity" />

              {/* 收藏按钮 */}
              <div className="absolute top-2 right-2 z-10">
                {showStar && (
                  <motion.div whileTap={{ scale: 0.85 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/70",
                        isStarred && "text-yellow-500 hover:text-yellow-600"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (id && onStarClick) onStarClick(id);
                      }}
                    >
                      {showStar && (
                        <Star
                          className={cn(
                            "w-5 h-5 transition-transform",
                            isStarred ? "fill-current scale-110" : "fill-none"
                          )}
                        />
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* 评分显示 */}
              <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs font-medium flex items-center">
                <div className="flex mr-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">
                      {i < fullStars ? (
                        <span className="text-yellow-400">★</span>
                      ) : i === fullStars && hasHalfStar ? (
                        <span className="text-yellow-400">⯨</span>
                      ) : (
                        <span className="text-gray-400">☆</span>
                      )}
                    </span>
                  ))}
                </div>
                <span>{rating}</span>
              </div>

              {/* 位置标签 */}
              {location && (
                <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs font-medium flex items-center">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  <span className="inline-block max-w-[100px] truncate">
                    {location}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              {/* 景点名称 */}
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors truncate">
                {name}
              </h3>

              {/* 描述信息 */}
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {description}
              </p>

              {/* 最佳季节 */}
              {bestSeason && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>最佳季节: {bestSeason}</span>
                </div>
              )}

              {/* 查看详情按钮 */}
              <motion.div
                className="mt-3 text-sm font-medium text-primary flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Info className="w-3 h-3 mr-1" />
                查看详情
                <motion.span
                  className="ml-1"
                  animate={{ x: isHovered ? 3 : 0 }}
                  transition={{
                    repeat: isHovered ? Infinity : 0,
                    repeatType: "reverse",
                    duration: 0.4,
                  }}
                >
                  →
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        );
      }
    ),
  { ssr: false } // 完全禁用SSR
);

export default function SpotCard(props: SpotCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 在服务端或客户端首次渲染时使用静态版本
  if (!isMounted) {
    return <StaticSpotCard {...props} />;
  }

  // 客户端挂载后使用动画版本
  return <AnimatedSpotCard {...props} />;
}
