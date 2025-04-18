"use client";

import { cn } from "@/lib/utils";
import { MapPin, Clock, Calendar, Footprints } from "lucide-react";

export interface TripCardProps {
  title: string;
  days: number;
  nights?: number;
  location: string;
  bestSeason: string;
  highlights: string;
  image: string;
  className?: string;
  type?: "regular" | "cityWalk";
  onClick?: (tripData: Omit<TripCardProps, "onClick" | "className">) => void;
}

export default function TripCard({
  title,
  days,
  nights = days - 1,
  location,
  bestSeason,
  highlights,
  image,
  className,
  type = "regular",
  onClick,
}: TripCardProps) {
  // 根据类型决定渐变色
  const gradientClass =
    type === "cityWalk"
      ? "from-emerald-600/80 to-teal-600/60"
      : "from-blue-600/80 to-indigo-600/60";

  // 创建要传递给onClick的数据对象
  const tripData = {
    title,
    days,
    nights,
    location,
    bestSeason,
    highlights,
    image,
    type,
  };

  return (
    <div
      onClick={() => onClick?.(tripData)}
      className={cn(
        "w-full h-[200px] rounded-lg shadow-lg overflow-hidden relative group hover:shadow-xl transition-all duration-300",
        className
      )}
      style={{
        backgroundImage: `url('${image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 渐变遮罩 */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradientClass}`}
      ></div>

      {/* 内容 */}
      <div className="relative z-10 h-full w-full p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded backdrop-blur-sm flex items-center">
            {type === "cityWalk" ? (
              <>
                <Footprints className="w-3 h-3 mr-1" />
                城市徒步
              </>
            ) : (
              "精选行程"
            )}
          </span>
          <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded backdrop-blur-sm flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {days}天{nights > 0 ? `${nights}晚` : ""}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white drop-shadow-md">
            {title}
          </h3>
          <p className="text-white/90 text-sm line-clamp-1">{highlights}</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center text-xs font-medium text-white/80">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate max-w-[80px]">{location}</span>
            </span>
            <span className="inline-flex items-center text-xs font-medium text-white/80">
              <Calendar className="w-3 h-3 mr-1" />
              最佳季节：{bestSeason}
            </span>
          </div>
        </div>
      </div>

      {/* 悬停效果 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}
