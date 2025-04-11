/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-02 15:39:27
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-11 12:55:59
 * @FilePath: \dalieba\components\home\componentsHome\spot-card.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

export default function SpotCard({ 
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
  onClick
}: SpotCardProps) {
  return (
    <div 
      className={cn(
        "group flex-shrink-0 w-[220px] md:w-auto bg-background rounded-lg shadow-md overflow-hidden snap-start cursor-pointer hover:scale-102 transition-all duration-300", 
        className
      )}
      onClick={onClick}
    >
      <div className="h-40 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute top-2 right-2">
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
            <Star className={cn(
              "w-5 h-5 transition-all",
              isStarred ? "fill-current" : "fill-none"
            )} />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{name}</h3>
          {rating && (
            <span className="text-sm text-yellow-500">⭐ {rating}</span>
          )}
        </div>
        {location && (
          <p className="text-sm text-muted-foreground mb-1">
            📍 {location}
          </p>
        )}
        <p className="text-sm text-muted-foreground mb-2">
          {description}
        </p>
        {bestSeason && (
          <p className="text-xs text-muted-foreground">
            🌞 {bestSeason}
          </p>
        )}
      </div>
    </div>
  );
} 