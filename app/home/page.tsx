/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-18 16:06:37
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-21 17:35:30
 * @FilePath: \dalieba\app\home\page.tsx
 * @Description: 首页样式
 */
'use client'

import { motion } from "motion/react"
import ControlBar from "@/components/ui/control-bar"
import MapComponent from "@/components/map/MapComponent"
import { useEffect, useState } from "react"
import { Footprints, Mic, UtensilsCrossed, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import React from "react"
import { Input } from "@/components/ui/input"
import MapPersonalCard from "@/components/ui/mapPersonalCard"
import { useClientTheme } from "@/lib/client-theme"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import UserClient from '@/lib/use-client'
// 哈尔滨景点数据
const ATTRACTIONS = [
    {
        name: "哈尔滨极地公园",
        position: [45.785251, 126.586479] as [number, number],
        description: "中国规模最大的极地海洋动物主题公园"
    },
    {
        name: "圣·索菲亚教堂",
        position: [45.770125, 126.627215] as [number, number],
        description: "哈尔滨市标志性建筑，拜占庭式的俄罗斯东正教教堂"
    },
    {
        name: "东北虎林园",
        position: [45.817483, 126.600650] as [number, number],
        description: "世界上规模最大的东北虎人工繁育基地"
    },
    {
        name: "哈尔滨音乐公园",
        position: [45.749011, 126.548455] as [number, number],
        description: "以音乐为主题的城市公园"
    },
    {
        name: "哈尔滨市人民防洪胜利纪念塔",
        position: [45.780654, 126.617203] as [number, number],
        description: "纪念1957年抗洪胜利的标志性建筑"
    },
    {
        name: "哈尔滨市兆麟公园",
        position: [45.777327, 126.622915] as [number, number],
        description: "哈尔滨历史悠久的城市公园"
    },
    {
        name: "中华巴洛克风情街",
        position: [45.781791, 126.640729] as [number, number],
        description: "融合中西建筑风格的特色商业街"
    }
]

export default function HomePage() {
    const [currentCenter, setCurrentCenter] = useState(ATTRACTIONS[0].position)
    const [currentAttractionIndex, setCurrentAttractionIndex] = useState(0)
    const [markers, setMarkers] = useState<Array<{ position: [number, number], popup?: string }>>([])
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const resumeTimeout = React.useRef<NodeJS.Timeout | null>(null)
    const [positions, setPositions] = useState<[number, number][]>([])
    const theme = useClientTheme()
    const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isFocus, setIsFocus] = useState(false)
    const router = useRouter()
    const userClient = new UserClient();
    // 创建所有景点的标记
    useEffect( () => {
        const allMarkers = ATTRACTIONS.map(attraction => ({
            position: attraction.position,
            popup: attraction.name,
            description: attraction.description
        }))
        setMarkers(allMarkers)
        // // 创建路径
        // setPositions(PATHS)
        userClient.getToken() ? '' : router.push("/login")

        const checkToken = async () => {
          const isValid = await userClient.verifyToken();
          if (!isValid) {
            // 如果token无效，可以选择重定向或其他操作
            router.push("/login")
          }
        };
    
        checkToken();
        
    }, [])

    // 自动轮播景点
    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentAttractionIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % ATTRACTIONS.length
                setCurrentCenter(ATTRACTIONS[nextIndex].position)
                setSelectedMarker(nextIndex)
                return nextIndex
            })
        }, 8000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const handleDragStart = () => {
        setIsAutoPlaying(false)
        if (resumeTimeout.current) {
            clearTimeout(resumeTimeout.current)
        }
    }

    const handleDragEnd = () => {
        if (resumeTimeout.current) {
            clearTimeout(resumeTimeout.current)
        }
        resumeTimeout.current = setTimeout(() => {
            setIsAutoPlaying(true)
        }, 1000)
    }

    // 切换到特定景点
    const goToAttraction = (index: number) => {
        setCurrentAttractionIndex(index)
        setCurrentCenter(ATTRACTIONS[index].position)
        setSelectedMarker(index)

        // 可选：暂停自动轮播
        if (isAutoPlaying && index !== (currentAttractionIndex + 1) % ATTRACTIONS.length) {
            setIsAutoPlaying(false)
        }
    }

    const handleFocus = () => {
        setIsFocus(true)
        setIsCollapsed(true)
    }

    const handleBlur = () => {
        setIsFocus(false)
        setIsCollapsed(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          const inputValue = e.currentTarget.value
          if (inputValue.trim() === '') {
            return
          }
          router.push(`/newplan/djks32Dsa1s4rfcS5r`)
        }
    }
    // 当前景点信息
    const currentAttraction = ATTRACTIONS[currentAttractionIndex]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <MapComponent
        showZoomLevel={false}
        center={currentCenter}
        zoom={14}
        maxZoom={16}
        minZoom={13}
        markers={markers}
        className="w-full h-full fixed top-0 left-0 right-0 bottom-0"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        layOutisPoints={true}
        positions={positions}
        selectedMarker={selectedMarker}
        onMarkerClose={() => setSelectedMarker(null)}
      />
      {/* 遮罩层 */}
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 bottom-0 z-40 user-select-none pointer-events-none transition-colors duration-300",
          {
            "bg-background/50": theme === "dark"
          }
        )}
      ></div>

      {/* 标题 - 移动端在左上角显示 */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <h1 className="text-xl font-bold text-foreground">
          GO! TOGETHER
        </h1>
      </div>

      {/* 收起按钮 - 移动端在右上角显示 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(isCollapsed ? "md:top-4!" : "md:top-[34rem]!", "fixed right-29 top-3 z-50 md:top-[34rem] md:left-4 md:right-auto text-foreground bg-background/50 backdrop-blur-sm rounded-full")}
      >
        {isCollapsed ? 
          <ChevronDown className="w-4 h-4" />

         : 
          <ChevronUp className="w-4 h-4" />
         }
      </Button>

      {/* 控制栏 */}
      <ControlBar />

      {/* 内容区域 - 移动端放在ControlBar下方 */}
      <motion.div 
        className="fixed top-[4.5rem] left-0 right-0 md:left-4 md:top-4 md:right-auto z-50 px-4 md:px-0"
        animate={{ 
          opacity: isCollapsed ? 0 : 1,
          y: isCollapsed ? -20 : 0,
          display: isCollapsed ? 'none' : 'block'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-3 md:w-[360px]">
          {/* LOGO - 仅在桌面端显示 */}
          <Card className="backdrop-blur-sm bg-background/70 border border-border shadow-lg overflow-hidden hidden md:block">
            <CardHeader className="py-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    GO!
                  </span>
                  <span className="text-2xl font-light tracking-wider text-foreground/80">
                    TOGETHER
                  </span>
                </CardTitle>
                <CardDescription className="tracking-wider">
                  规划行程，结伴而行
                </CardDescription>
              </motion.div>
            </CardHeader>
          </Card>

          {/* 个人信息卡片 */}
          <MapPersonalCard className="backdrop-blur-sm bg-background/70 md:w-[360px] w-full" />

          {/* 景点信息卡片 */}
          <Card className="backdrop-blur-sm bg-card/70 border border-border shadow-lg">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              key={currentAttraction.name}
            >
              <CardHeader className="py-3">
                <CardTitle className="text-base md:text-lg">{currentAttraction.name}</CardTitle>
                <CardDescription className="text-sm">{currentAttraction.description}</CardDescription>
              </CardHeader>
              <CardFooter className="py-3 flex justify-between items-center gap-4">
                <Button 
                  size="sm"
                  variant={isAutoPlaying ? "default" : "outline"}
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="text-xs h-8 px-3"
                >
                  {isAutoPlaying ? "暂停轮播" : "自动轮播"}
                </Button>
                
                {/* 景点选择器 */}
                <div className="flex items-center gap-1">
                  {ATTRACTIONS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToAttraction(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        index === currentAttractionIndex 
                          ? "bg-primary w-3" 
                          : "bg-muted-foreground/50"
                      }`}
                      aria-label={`切换到${ATTRACTIONS[index].name}`}
                    />
                  ))}
                </div>
              </CardFooter>
            </motion.div>
          </Card>
        </div>
      </motion.div>

      {/* 输入框区域 */}
      <div className="fixed z-60 bottom-16 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[30rem] flex items-center flex-col justify-center gap-3">
        {/* 快捷按钮 - 移动端水平滚动 */}
        <div className="w-full overflow-x-auto flex gap-2 pb-2 no-scrollbar">
          <Button className="bg-background/50 backdrop-blur-sm rounded-full p-2 px-4 flex items-center gap-2 text-foreground hover:bg-background/80 whitespace-nowrap text-sm">
            <Footprints className="w-4 h-4" />
            哈尔滨有什么玩的
          </Button>
          <Button className="bg-background/50 backdrop-blur-sm rounded-full p-2 px-4 flex items-center gap-2 text-foreground hover:bg-background/80 whitespace-nowrap text-sm">
            <UtensilsCrossed className="w-4 h-4" />
            哈尔滨美食推荐
          </Button>
        </div>
        
        {/* 搜索输入框 */}
        <div className="relative w-full bg-background/80 backdrop-blur-sm border border-border rounded-full">
          <Input
            onFocus={() => handleFocus()}
            onBlur={() => handleBlur()}
            onKeyDown={(e) => handleKeyDown(e)}
            className="h-11 pl-6 pr-12 text-sm rounded-full" 
            placeholder="Hi，我想去..." 
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8"
          >
            <Mic className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}