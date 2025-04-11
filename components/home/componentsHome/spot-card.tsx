/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-02 15:39:27
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-11 08:32:30
 * @FilePath: \dalieba\components\home\componentsHome\spot-card.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { cn } from "@/lib/utils";

interface SpotCardProps {
  name: string;
  rating: string;
  description: string;
  imageUrl: string;
  className?: string;
}

export default function SpotCard({ 
  name, 
  rating, 
  description, 
  imageUrl, 
  className 
}: SpotCardProps) {
  return (
    <div className={cn(
      "flex-shrink-0 w-[220px] md:w-auto bg-background rounded-lg shadow-md overflow-hidden snap-start cursor-pointer hover:scale-105 transition-all duration-300", 
      className
    )}>
      <div className="h-40 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{name}</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </div>
    </div>
  );
} 