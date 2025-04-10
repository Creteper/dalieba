/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-03-24 08:38:55
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-02 11:18:31
 * @FilePath: \dalieba\app\personal\stars\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client"

import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import SpotCard from "./components/spot-card";

// 模拟收藏的景点数据
const starredSpots = [
  {
    id: 1,
    name: "哈尔滨冰雪大世界",
    rating: "5.0",
    location: "松北区哈尔滨大世界",
    bestSeason: "冬季最佳，冰灯艺术的盛宴",
    imageUrl: "/images/djt.jpeg"
  },
  {
    id: 2,
    name: "中央大街",
    rating: "4.8",
    location: "松北区中央大街",
    bestSeason: "全年适宜，欧式建筑风情",
    imageUrl: "/images/djt.jpeg"
  },
  {
    id: 3,
    name: "索菲亚教堂",
    rating: "4.7",
    location: "道里区索菲亚广场",
    bestSeason: "全年适宜，巴洛克风格建筑",
    imageUrl: "/images/djt.jpeg"
  }
];

export default function Stars() {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold">我的收藏</h2>
                <Button variant="outline" size="sm">
                    查看地图 <MapPin className="ml-2 h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {starredSpots.map(spot => (
                    <SpotCard
                        key={spot.id}
                        name={spot.name}
                        rating={spot.rating}
                        location={spot.location}
                        bestSeason={spot.bestSeason}
                        imageUrl={spot.imageUrl}
                        isStarred={true}
                    />
                ))}
            </div>
        </div>
    )
}