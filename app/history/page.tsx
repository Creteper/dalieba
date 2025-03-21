"use client"

import MapComponent from "@/components/map/MapComponent"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, PanelLeft, PanelLeftClose } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import ControlBar from "@/components/ui/control-bar"
import { useIsMobile } from "@/hooks/use-mobile"
import { AlwaysDrawerContent, AlwaysDrawerHeader, AlwaysDrawerTrigger } from "@/components/ui/alwaysDrawer"
export default function History() {
    const [currentCenter, setCurrentCenter] = useState([45.780654, 126.617203] as [number, number])
    const resumeTimeout = useRef<NodeJS.Timeout | null>(null)
    const [historyHeight, setHistoryHeight] = useState(400)
    const [showDrag, setShowDrag] = useState(true)
    const [windowHeight, setWindowHeight] = useState(0)
    const [showToday, setShowToday] = useState(true)
    const [showYesterday, setShowYesterday] = useState(true)
    const [showAgo, setShowAgo] = useState(true)

    const [showHistory, setShowHistory] = useState(true)

    const router = useRouter()

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

    useEffect(() => {
        // 在客户端初始化窗口高度
        setWindowHeight(window.innerHeight)

        const handleResize = () => {
            setWindowHeight(window.innerHeight)
            if (window.innerWidth < 1024) {
                setHistoryHeight(400)
                setShowDrag(true)
            } else {
                setHistoryHeight(window.innerHeight)
                setShowDrag(false)
            }
        }

        // 组件挂载时检查一次
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const isMobile = useIsMobile()

    return (
        <>
            {isMobile ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="flex h-screen w-full user-select-none"
                >
                    <ControlBar title="历史记录" className="z-999" />
                    <Button className="fixed top-3 left-3 z-50" onClick={() => router.push("/home")}>
                        <PanelLeftClose />
                        返回主页
                    </Button>
                    <AlwaysDrawerContent
                        triggerContent={
                            <Button
                                className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
                            >
                                历史记录
                            </Button>
                        }
                    >
                        <AlwaysDrawerHeader>
                            <div className="px-10 flex gap-5 items-center pb-5">
                                <Input id="search" className="shadow-xl" placeholder="搜索历史记录" />
                                <Button size="sm">搜索</Button>
                            </div>
                        </AlwaysDrawerHeader>

                        <ScrollArea
                            style={{
                                height: `${Math.min(historyHeight, windowHeight)}px`
                            }}
                            className="w-full relative"
                        >

                            <div className={`px-10 flex flex-col gap-5 h-full`}>

                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowToday(!showToday)}>
                                    <motion.div
                                        animate={{ rotate: showToday ? 0 : -90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown />
                                    </motion.div>
                                    <p className="text-2xl">今天</p>
                                </div>

                                {showToday ?
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col gap-5 overflow-hidden"
                                    >
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                    </motion.div>
                                    :
                                    null
                                }
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowYesterday(!showYesterday)}>
                                    <motion.div
                                        animate={{ rotate: showYesterday ? 0 : -90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown />
                                    </motion.div>
                                    <p className="text-2xl">昨天</p>
                                </div>

                                {showYesterday ?
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col gap-5 overflow-hidden"
                                    >
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                    </motion.div>
                                    :
                                    null
                                }
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAgo(!showAgo)}>
                                    <motion.div
                                        animate={{ rotate: showAgo ? 0 : -90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown />
                                    </motion.div>
                                    <p className="text-2xl">更久以前</p>
                                </div>

                                {showAgo ?
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        transition={{ duration: 0.2 }} // 修改为较短的持续时间
                                        className="flex flex-col gap-5 overflow-hidden"
                                    >
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                        <HistoryCard
                                            title="哈尔滨一日游真好玩哈哈哈哈"
                                            description="先去这，再去那，最后找一家饭店猛吃一顿"
                                            miles="15km"
                                            times="16分钟"
                                        />
                                    </motion.div>
                                    :
                                    null
                                }
                            </div>
                        </ScrollArea>
                    </AlwaysDrawerContent >

                    <MapComponent
                        showZoomLevel={true}
                        center={currentCenter}
                        zoom={14}
                        maxZoom={16}
                        minZoom={13}
                        className="w-full h-full"
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        layOutisPoints={true}
                    />
                </motion.div >
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="flex h-screen w-full user-select-none"
                >
                    <ControlBar title="历史记录" className="z-999" />

                    <div>
                        {!showHistory ? (
                            <Button
                                onClick={() => setShowHistory(!showHistory)}
                                className="fixed top-5 left-5 z-50"
                            >
                                <PanelLeft />
                            </Button>
                        ) : null}
                    </div>

                    <ScrollArea
                        style={{
                            ...(showHistory ? {} : { display: "none" }),
                        }}
                        className="2xl:w-4/12 xl:w-5/12 lg:w-7/12 md:w-11/12 h-full relative shadow-lg bg-muted "
                    >
                        <div className="sticky top-0 z-50 bg-muted">
                            <div className="flex justify-between items-center justify-items-center px-5 py-3">
                                <Button onClick={() => router.push("/home")}>
                                    <PanelLeftClose />
                                    返回主页
                                </Button>
                                <Button
                                    onClick={() => setShowHistory(!showHistory)}
                                    variant="ghost"
                                >
                                    <PanelLeft onClick={() => setShowHistory(!showHistory)} className="" />
                                </Button>
                            </div>
                            <div className="px-10 flex gap-5 items-center pb-5">
                                <Input id="search" className="shadow-xl" placeholder="搜索历史记录" />
                                <Button size="sm">搜索</Button>
                            </div>
                        </div>

                        <div className={`px-10 flex flex-col gap-5 h-full`}>

                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowToday(!showToday)}>
                                <motion.div
                                    animate={{ rotate: showToday ? 0 : -90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown />
                                </motion.div>
                                <p className="text-2xl">今天</p>
                            </div>

                            {showToday ?
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col gap-5 overflow-hidden"
                                >
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                </motion.div>
                                :
                                null
                            }
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowYesterday(!showYesterday)}>
                                <motion.div
                                    animate={{ rotate: showYesterday ? 0 : -90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown />
                                </motion.div>
                                <p className="text-2xl">昨天</p>
                            </div>

                            {showYesterday ?
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col gap-5 overflow-hidden"
                                >
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                </motion.div>
                                :
                                null
                            }
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAgo(!showAgo)}>
                                <motion.div
                                    animate={{ rotate: showAgo ? 0 : -90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown />
                                </motion.div>
                                <p className="text-2xl">更久以前</p>
                            </div>

                            {showAgo ?
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    transition={{ duration: 0.2 }} // 修改为较短的持续时间
                                    className="flex flex-col gap-5 overflow-hidden"
                                >
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                    <HistoryCard
                                        title="哈尔滨一日游真好玩哈哈哈哈"
                                        description="先去这，再去那，最后找一家饭店猛吃一顿"
                                        miles="15km"
                                        times="16分钟"
                                    />
                                </motion.div>
                                :
                                null
                            }
                        </div>
                    </ScrollArea>

                    <MapComponent
                        showZoomLevel={true}
                        center={currentCenter}
                        zoom={14}
                        maxZoom={16}
                        minZoom={13}
                        className="w-full h-full"
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        layOutisPoints={true}
                    />
                </motion.div >
            )
            }
        </>
        // <motion.div
        //     initial={{ opacity: 0 }}
        //     animate={{ opacity: 1 }}
        //     transition={{ duration: 1 }}
        //     className="flex h-screen w-full flex-col-reverse lg:flex-row user-select-none"
        // >
        //     <ControlBar title="历史记录" className="z-999" />
        //     {showDrag && (
        //         <Button className="fixed top-3 left-3 z-50" onClick={() => router.push("/home")}>
        //             <PanelLeftClose />
        //             返回主页
        //         </Button>
        //     )}
        //     <div>
        //         {!showHistory ? (
        //             <Button
        //                 onClick={() => setShowHistory(!showHistory)}
        //                 className="fixed top-5 left-5 z-50"
        //             >
        //                 <PanelLeft />
        //             </Button>
        //         ) : null}
        //     </div>


        //     <div className="w-full h-full">
        //         <MapComponent
        //             showZoomLevel={true}
        //             center={currentCenter}
        //             zoom={14}
        //             maxZoom={16}
        //             minZoom={13}
        //             className="w-full h-full"
        //             onDragStart={handleDragStart}
        //             onDragEnd={handleDragEnd}
        //             layOutisPoints={true}
        //         />
        //     </div>
        // </motion.div >
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