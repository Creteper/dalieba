/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-11 08:35:39
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-11 11:26:32
 * @FilePath: \dalieba\app\createplan\[planid]\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ControlBar from "@/components/ui/control-bar";
import MapComponent from "@/components/map/MapComponent";
import AiChat from "@/lib/ai-chat";
import { toast } from "sonner";
import { PlanDetailResponse, PlanResponse } from "@/types/article";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import TimeLine, { TimeLineItem } from '@/components/plan/time-line'
import ScenicSpot from "@/lib/scenic-spot";
import { ScenicSpotResponse } from "@/types/article";
const globalStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(155, 155, 155, 0.7);
  }
`;

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [planDetails, setPlanDetails] = useState<PlanDetailResponse | null>(
    null
  );
  const [timelineItems, setTimelineItems] = useState<TimeLineItem[]>([]);
  const [activeTimelineItem, setActiveTimelineItem] = useState<string | number | undefined>(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSetTitleDrawerOpen, setIsSetTitleDrawerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const planId = decodeURIComponent(params.planid as string);
  const aiChat = new AiChat();
  const scenicSpot = new ScenicSpot();
  const [isLoading, setIsLoading] = useState(false);
  const [scenicSpotList, setScenicSpotList] = useState<ScenicSpotResponse | null>(null);
  const [center, setCenter] = useState<[number, number]>([
    45.774835, 126.617682,
  ]);
  useEffect(() => {
    // 解析planid中的参数
    const [location, days, budget, preference] = planId.split(" ");

    // 获取所有景点
    async function getAllScenicSpot() {
      const res: ScenicSpotResponse = await scenicSpot.getAllScenicSpot<ScenicSpotResponse>();
      setScenicSpotList(res);
    }

    getAllScenicSpot();
  }, [planId]);

  // 监听 scenicSpotList 变化，当有数据时再获取攻略
  useEffect(() => {
    if (scenicSpotList) {
      async function getChatContent() {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          toast.error("请先登录");
          return;
        }
        setIsLoading(true);
        const res: PlanDetailResponse = await aiChat.getPlan<PlanDetailResponse>(userId, planId);
        setPlanDetails(res);
        setTitle(res.data[0].title);
        analysisPlanResponse(res, setTimelineItems, setIsDrawerOpen, scenicSpotList);
        setIsLoading(false);
      }
      getChatContent();
    }
  }, [scenicSpotList, planId]);

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = globalStyles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const handleTimelineItemClick = (item: { id: string | number; title: string; description: string; street: string; date: string; thumbnail: string; position: { latitude: number; longitude: number; }; transport?: { type: string; duration: string; cost: string; } | undefined; }) => {
    setActiveTimelineItem(item.id);
  };

  return (
    <motion.div
      className="w-full h-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <ControlBar variant="reversalDefault" />
      <MapComponent
        showZoomLevel={false}
        className="w-full h-full rounded-md shadow-md"
        center={center}
        maxZoom={15}
        minZoom={10}
      />
      {isLoading ? (
        <div className="fixed top-4 left-4 z-60">
          <Button variant="reversalDefault" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          返回
        </Button>
      </div>
      ) : (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
          <Button 
            className="fixed bottom-4 -translate-x-1/2 left-1/2 z-999 bg-background/90 backdrop-blur-sm text-foreground hover:bg-background/90 hover:text-foreground"
          >
            查看攻略
          </Button>
        </DrawerTrigger>
        <DrawerContent className="z-999 h-[80vh] md:h-[500px] bg-background/90 backdrop-blur-md">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold">
              {title || "哈尔滨旅游攻略"}
            </DrawerTitle>
            <DrawerDescription>
              {timelineItems.length > 0 ? `共 ${timelineItems.length} 天行程` : "正在加载行程..."}
            </DrawerDescription>
          </DrawerHeader>
          
          {/* 手机端 */}
          <div 
            className="block md:hidden px-4 overflow-y-auto flex-1 custom-scrollbar" 
            style={{ 
              height: "calc(80vh - 150px)",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
              cursor: "grab",
              userSelect: "none"
            }}
          >
            {isDrawerOpen && timelineItems.length > 0 && (
              <TimeLine
                items={timelineItems}
                direction="vertical"
                activeId={activeTimelineItem}
                onItemClick={(spot) => {
                  setActiveTimelineItem(spot.id);
                  setCenter([spot.position.latitude, spot.position.longitude]);
                }}
                className="w-full py-4"
              />
            )}
          </div>

          {/* 电脑端 */}
          <div 
            className="hidden md:block px-4 overflow-x-auto flex-1 custom-scrollbar" 
            style={{ 
              height: "calc(500px - 150px)",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
              cursor: "grab",
              userSelect: "none"
            }}
            onMouseDown={(e) => {
              const ele = e.currentTarget;
              const startX = e.pageX - ele.offsetLeft;
              const startY = e.pageY - ele.offsetTop;
              const startScrollLeft = ele.scrollLeft;
              const startScrollTop = ele.scrollTop;
              
              const handleMouseMove = (e: MouseEvent) => {
                e.preventDefault();
                const x = e.pageX - ele.offsetLeft;
                const y = e.pageY - ele.offsetTop;
                const walkX = (x - startX);
                const walkY = (y - startY);
                ele.scrollLeft = startScrollLeft - walkX;
                ele.scrollTop = startScrollTop - walkY;
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                ele.style.cursor = 'grab';
              };
              
              ele.style.cursor = 'grabbing';
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            {isDrawerOpen && timelineItems.length > 0 && (
              <TimeLine
                items={timelineItems}
                direction="horizontal"
                activeId={activeTimelineItem}
                onItemClick={(spot) => {
                  setActiveTimelineItem(spot.id);
                  setCenter([spot.position.latitude, spot.position.longitude]);
                }}
                className="w-full min-w-fit py-4"
              />
            )}
          </div>
          
          <DrawerFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              关闭
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      )}
    </motion.div>
  );
}

type ScenicSpotResult = {
  day: number;
  time: string;
  description: string;
  address: string;
}

function analysisPlanResponse(
  planResponse: PlanDetailResponse,
  setTimelineItems: (items: TimeLineItem[]) => void,
  setIsDrawerOpen: (open: boolean) => void,
  scenicSpotList: ScenicSpotResponse | null
) {
  const timelineItemsMap = new Map<number, TimeLineItem>();
  let spotIndex = 0;
  
  planResponse.data.forEach((item) => {
    const response: PlanResponse = JSON.parse(item.response);
    response.plan.forEach(plan => {
      let ScenicSpotName = plan.name;
      const scenicSpotResult = analysisResult(plan.result, scenicSpotList, ScenicSpotName);
      console.log("处理景点:", ScenicSpotName, scenicSpotResult);
      
      const uniqueId = `${scenicSpotResult.day}-${spotIndex}`;
      spotIndex++;
      
      // 从描述中提取街道信息
      const street = scenicSpotResult.address;
      console.log("景点地址:", street);
      // 从描述中提取交通信息
      const transportMatch = scenicSpotResult.description.match(/交通：([^\n]+)/);
      const transport = {
        type: "步行/打车",
        duration: "10-15分钟",
        cost: "¥10-20"
      };
      
      const spot = {
        id: uniqueId,
        title: ScenicSpotName,
        description: scenicSpotResult.description,
        street: street,
        date: scenicSpotResult.time,
        thumbnail: "/images/djt.jpeg",
        position: {
          latitude: 45.770125,
          longitude: 126.627215
        },
        transport: transport
      };

      // 如果这一天的数据已存在，则添加到spots数组中
      if (timelineItemsMap.has(scenicSpotResult.day)) {
        const existingItem = timelineItemsMap.get(scenicSpotResult.day)!;
        existingItem.spots.push(spot);
      } else {
        // 如果这一天的数据不存在，则创建新的数据
        timelineItemsMap.set(scenicSpotResult.day, {
          id: `day-${scenicSpotResult.day}`,
          day: scenicSpotResult.day,
          spots: [spot]
        });
      }
    });
  });

  // 将Map转换为数组并按天数排序
  const timelineItems = Array.from(timelineItemsMap.values()).sort((a, b) => a.day - b.day);
  setTimelineItems(timelineItems);
  setIsDrawerOpen(true);
}


function analysisResult (result: string, scenicSpotList: ScenicSpotResponse | null, name: string) {
  const _result = result.split("---");
  
  let returnResult: ScenicSpotResult = {
    day: 0,
    time: "",
    description: "",
    address: "",
  };

  // 解析天数
  const dayMatch = _result[0].match(/第([一二三四五六七八九十百千万]+)天/);
  if (dayMatch) {
    const chineseNumber = dayMatch[1];
    const numberMap: { [key: string]: number } = {
      '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
      '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
      '十一': 11, '十二': 12, '十三': 13, '十四': 14, '十五': 15,
      '十六': 16, '十七': 17, '十八': 18, '十九': 19, '二十': 20,
      '二十一': 21, '二十二': 22, '二十三': 23, '二十四': 24, '二十五': 25,
      '二十六': 26, '二十七': 27, '二十八': 28, '二十九': 29, '三十': 30
    };
    returnResult.day = numberMap[chineseNumber] || 0;
  }

  returnResult.time = _result[1];
  returnResult.description = _result[2] + _result[3];
  returnResult.address = findScenicSpot(name, scenicSpotList);

  return returnResult;
}

function analysisLocation(location: string) {
  const _location = location.split(" ");
  return _location;
}

function findScenicSpot(name: string, scenicSpotList: ScenicSpotResponse | null) {
  if (!scenicSpotList?.sights || !name) return "";

  // 数字转换函数
  function convertChineseToNumber(text: string): string {
    const chineseNumbers: { [key: string]: string } = {
      '零': '0', '一': '1', '二': '2', '三': '3', '四': '4',
      '五': '5', '六': '6', '七': '7', '八': '8', '九': '9'
    };
    return text.split('').map(char => chineseNumbers[char] || char).join('');
  }

  // 标准化文本处理
  function normalizeText(text: string): string {
    // 转换中文数字为阿拉伯数字
    let normalized = convertChineseToNumber(text);
    // 移除所有空格并转换为小写
    normalized = normalized.replace(/\s+/g, '').toLowerCase();
    // 移除特殊字符
    normalized = normalized.replace(/[,，.。\-_\/\\]/g, '');
    return normalized;
  }

  const normalizedName = normalizeText(name);
  
  let bestMatch = null;
  let maxMatchScore = 0;

  for (const spot of scenicSpotList.sights) {
    const normalizedSpotName = normalizeText(spot.name);
    let matchScore = 0;

    // 1. 完全匹配检查
    if (normalizedSpotName === normalizedName) {
      matchScore += 100;
    }

    // 2. 包含关系检查
    if (normalizedSpotName.includes(normalizedName) || normalizedName.includes(normalizedSpotName)) {
      matchScore += 50;
    }

    // 3. 关键词匹配
    const nameWords = normalizedName.match(/[\u4e00-\u9fa5]+|\d+/g) || [];
    const spotWords = normalizedSpotName.match(/[\u4e00-\u9fa5]+|\d+/g) || [];

    for (const word of nameWords) {
      if (word.length < 2) continue;
      if (spotWords.some(spotWord => 
        spotWord.includes(word) || 
        word.includes(spotWord) ||
        (word.length >= 2 && spotWord.length >= 2 && 
         (word.includes(spotWord.slice(0, 2)) || spotWord.includes(word.slice(0, 2))))
      )) {
        matchScore += word.length * 2;
      }
    }

    // 4. 数字匹配（特殊处理）
    const nameNumbers = normalizedName.match(/\d+/g) || [];
    const spotNumbers = normalizedSpotName.match(/\d+/g) || [];
    
    for (const num of nameNumbers) {
      if (spotNumbers.some(spotNum => spotNum === num)) {
        matchScore += num.length * 5;  // 数字匹配给予更高的分数
      }
    }

    console.log("比对景点:", spot.name, "->", name, "分数:", matchScore);

    if (matchScore > maxMatchScore) {
      maxMatchScore = matchScore;
      bestMatch = spot;
    }
  }

  if (bestMatch && maxMatchScore > 10) {  // 提高阈值
    console.log("最佳匹配:", bestMatch.name, "->", name, "分数:", maxMatchScore);
    return bestMatch.address || "";
  }

  return "";
}

