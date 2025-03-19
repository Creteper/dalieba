"use client"

import MapComponent from "@/components/map/MapComponent"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "motion/react"
import { useRef, useState } from "react"

export default function History() {
    const [currentCenter, setCurrentCenter] = useState([45.780654, 126.617203] as [number, number])
    const resumeTimeout = useRef<NodeJS.Timeout | null>(null)
    const handleDragStart = () => {
        if (resumeTimeout.current) {
            clearTimeout(resumeTimeout.current)
        }
    }

    const handleDragEnd = () => {
        if (resumeTimeout.current) {
            clearTimeout(resumeTimeout.current)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex h-screen w-full"
        >
            {/* 左侧历史记录列表 */}
            <ScrollArea className="w-1/4 h-full p-10 relative z-10 bg-white shadow-lg">
                <div className="flex flex-col gap-5 z-50">
                    <HistoryCard
                        title="哈尔滨一日游真好玩哈哈哈哈"
                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                        miles="15km"
                        times="16分钟"
                    />
                    {/* 省略其余重复 HistoryCard */}
                </div>
            </ScrollArea>

            {/* 右侧地图，移除 fixed，改成 flex-item */}
            <div className="w-3/4 h-full z-0">
                <MapComponent
                    showZoomLevel={true}
                    center={currentCenter}
                    zoom={14}
                    maxZoom={16}
                    minZoom={13}
                    className="w-full h-full"
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    layOutisPoints={false}
                />
            </div>
        </motion.div>
    )
}

function HistoryCard({ title, description, miles, times }: { title: string, description: string, miles: string, times: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
                <CardDescription>
                    共计路程：{miles}
                </CardDescription>
                <CardDescription>
                    总预计用时：{times}
                </CardDescription>
            </CardFooter>
        </Card>
    )
}