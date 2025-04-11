/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-03-24 08:38:55
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-11 13:45:34
 * @FilePath: \dalieba\app\personal\stars\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client"

import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import SpotCard from "@/components/home/componentsHome/spot-card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ScenicSpot from "@/lib/scenic-spot";
import { StarredScenicSpotResponse } from "@/types/article";
import { useRouter } from "next/navigation";

export default function Stars() {
    const router = useRouter();
    const scenicSpot = new ScenicSpot();
    const [starredSpots, setStarredSpots] = useState<StarredScenicSpotResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStarredSpots();
    }, []);

    const fetchStarredSpots = async () => {
        try {
            setIsLoading(true);
            const response = await scenicSpot.getStarredScenicSpot<{code: number, book_mark: any[]}>(); 
            if (response && response.book_mark && Array.isArray(response.book_mark)) {
                // 转换数据结构
                const transformedData = response.book_mark.map(item => ({
                    id: item.gd_id,
                    name: item.name,
                    address: item.address,
                    localtion: item.location, // 注意API中返回的是location而非localtion
                    pname: "",
                    city_name: "",
                    adname: ""
                }));
                console.log("收藏数据:", response.book_mark);
                console.log("转换后:", transformedData);
                setStarredSpots(transformedData);
            } else {
                console.error("收藏数据格式错误:", response);
                toast.error("获取收藏列表失败");
            }
        } catch (error) {
            console.error("获取收藏景点失败", error);
            toast.error("获取收藏列表失败，请检查网络连接");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnstar = async (id: number) => {
        try {
            const spotToRemove = starredSpots.find(spot => spot.id === id);
            if (!spotToRemove) {
                toast.error("景点数据不存在");
                return;
            }

            // 立即更新UI
            setStarredSpots(prev => prev.filter(spot => spot.id !== id));
            
            // 调用API
            await scenicSpot.deleteStarredScenicSpot(spotToRemove);
            toast.success("已取消收藏");
        } catch (error) {
            // 如果失败，恢复数据
            fetchStarredSpots();
            toast.error("取消收藏失败，请重试");
        }
    };

    const handleSpotClick = (id: number) => {
        // TODO: 跳转到景点详情页
        console.log("点击景点:", id);
        // router.push(`/scenic/${id}`);
    };

    if (isLoading) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="ml-2">正在加载收藏...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold">我的收藏</h2>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push("/allScenicSpot")}
                >
                    查看地图 <MapPin className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {starredSpots.length === 0 ? (
                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-8 text-center">
                    <p className="text-lg font-medium mb-2">您还没有收藏任何景点</p>
                    <p className="text-muted-foreground mb-4">浏览景点并点击收藏按钮来添加您喜欢的地点</p>
                    <Button onClick={() => router.push("/allScenicSpotCard")}>
                        浏览景点
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {starredSpots.map(spot => (
                        <SpotCard
                            key={spot.id}
                            id={spot.id}
                            name={spot.name}
                            rating="5.0"
                            description={spot.address}
                            location={spot.address}
                            imageUrl="/images/djt.jpeg"
                            isStarred={true}
                            onStarClick={handleUnstar}
                            onClick={() => handleSpotClick(spot.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}