/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-18 16:06:37
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-19 11:12:45
 * @FilePath: \dalieba\app\home\page.tsx
 * @Description: 首页样式
 */
'use client'

import { motion } from "motion/react"
import ControlBar from "@/components/ui/control-bar"
import MapComponent from "@/components/map/MapComponent"
import { useEffect, useState } from "react"
import { Footprints, Mic } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import React from "react"
import { Input } from "@/components/ui/input"
import MapPersonalCard from "@/components/ui/mapPersonalCard"
import { useClientTheme } from "@/lib/client-theme"
import { cn } from "@/lib/utils"
import { Typewriter } from 'react-simple-typewriter'
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

const PATHS = [
  [45.780304, 126.617201] as [number, number],
  [45.780013, 126.617296] as [number, number],
  [45.779449, 126.6175] as [number, number],
  [45.778911, 126.617635] as [number, number],
  [45.77875, 126.617678] as [number, number],
  [45.778624, 126.617726] as [number, number],
  [45.77862, 126.617726] as [number, number],
  [45.778659, 126.617947] as [number, number],
  [45.77872, 126.618394] as [number, number]
]

export default function HomePage() {
  const [currentCenter, setCurrentCenter] = useState(ATTRACTIONS[0].position)
  const [currentAttractionIndex, setCurrentAttractionIndex] = useState(0)
  const [markers, setMarkers] = useState<Array<{position: [number, number], popup?: string}>>([])
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const resumeTimeout = React.useRef<NodeJS.Timeout | null>(null)
  const [positions, setPositions] = useState<[number, number][]>([])
  const theme = useClientTheme()

  // 创建所有景点的标记
  useEffect(() => {
    const allMarkers = ATTRACTIONS.map(attraction => ({
      position: attraction.position,
      popup: attraction.name,
      description: attraction.description
    }))
    setMarkers(allMarkers)
    // 创建路径
    setPositions(PATHS)
  }, [])
  
  // 自动轮播景点
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentAttractionIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % ATTRACTIONS.length
        setCurrentCenter(ATTRACTIONS[nextIndex].position)
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
    
    // 可选：暂停自动轮播
    if (isAutoPlaying && index !== (currentAttractionIndex + 1) % ATTRACTIONS.length) {
      setIsAutoPlaying(false)
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
        showZoomLevel={true}
        center={currentCenter}
        zoom={14}
        maxZoom={16}
        minZoom={13}
        markers={markers}
        className="w-full h-full fixed top-0 left-0 right-0 bottom-0"
        onMapDragStart={handleDragStart}
        onMapDragEnd={handleDragEnd}
        layOutisPoints={false}
        positions={positions}
      />

      {/* 控制栏 */}
      <ControlBar />
      {/* 输入框 */}
      <div className="fixed z-50 bottom-16 left-1/2 -translate-x-1/2 w-[calc(80%)] md:w-[30rem] h-32 flex items-center flex-col justify-center gap-4">
        <div className="flex justify-between w-full">
          <Button className="bg-background/50 backdrop-blur-sm rounded-full p-2 px-4 flex items-center gap-2 text-foreground hover:bg-background/80">
            <Footprints className="w-4 h-4" />
            <Typewriter
              words={["哈尔滨有什么玩的"]}
              typeSpeed={100}
            />
          </Button>
          <Button className="bg-background/50 backdrop-blur-sm rounded-full p-2 px-4 flex items-center gap-2 text-foreground hover:bg-background/80">
            <Footprints className="w-4 h-4" />
            <Typewriter
              words={["哈尔滨有什么玩的"]}
              typeSpeed={100}
            />
          </Button>
        </div>
        <div className="relative w-full">
          <Input className="bg-background/80! backdrop-blur-sm border border-border h-16 rounded-full pl-8 text-lg! " placeholder="Hi" />
          <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full">
            <Mic className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="fixed top-16 left-1/2 -translate-x-1/2 md:left-4 md:top-4 md:translate-x-0 flex flex-col gap-4 z-50">
        <MapPersonalCard className=" backdrop-blur-sm bg-background/80" />
        {/* 景点信息展示 - 使用shadcn UI的Card组件 */}
        <div className="max-w-md">
          <Card className="backdrop-blur-sm bg-card/80 border border-border shadow-lg">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              key={currentAttraction.name}
            >
              <CardHeader>
                <CardTitle>
                  <Typewriter
                    words={[currentAttraction.name]}
                    typeSpeed={100}
                  />
                </CardTitle>
                <CardDescription>
                  <Typewriter
                    words={[currentAttraction.description]}
                    typeSpeed={100}
                  />
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-2 flex justify-between items-center gap-6">
                <Button 
                  size="sm"
                  variant={isAutoPlaying ? "default" : "outline"}
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                >
                  {isAutoPlaying ? "暂停轮播" : "自动轮播"}
                </Button>
                
                {/* 景点选择器 */}
                <div className="flex items-center gap-1.5">
                  {ATTRACTIONS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToAttraction(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentAttractionIndex 
                          ? "bg-primary w-4" 
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
      </div>
    </motion.div>
  )
}