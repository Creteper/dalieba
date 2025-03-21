/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-20 10:31:48
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-20 19:51:12
 * @FilePath: \dalieba\components\plan\spot-card.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { AnimatePresence } from 'motion/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

export interface SpotCardProps {
    title: string
    description: string
    spot: {
        name: string,
        street: string,
    }[]
    DayPlan?: {
        spotDescription: {
            name: string,
            street: string,
            description: string,
            image: string,
            openTime: string,
            closeTime: string,
            toNextSpotDescription: {
                goType: string,
                time: string,
                price: string,
            }[]
        }[]
    }[]
}

export default function SpotCard({ title, description, spot, DayPlan = [] }: SpotCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className='w-full'
        >
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-6">
                        {DayPlan.map((day, dayIndex) => (
                            <div key={dayIndex} className="w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                                        {dayIndex + 1}
                                    </div>
                                    <h2 className="text-lg font-semibold">第 {dayIndex + 1} 天</h2>
                                </div>
                                <div className="relative pl-4 space-y-4">
                                    {/* 左侧时间线 */}
                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
                                    
                                    {day.spotDescription.map((spot, spotIndex) => (
                                        <div key={spotIndex} className="relative">
                                            {/* 时间线上的圆点 */}
                                            <div className="absolute -left-[1.15rem] top-4 w-3 h-3 rounded-full bg-background border-2 border-primary" />
                                            
                                            <div className="w-full p-4 bg-background/40 rounded-lg">
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-semibold">{spot.name}</h3>
                                                            <p className="text-sm text-gray-500">{spot.street}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-background/60 px-3 py-1 rounded">
                                                            <span>⏰</span>
                                                            <span>{spot.openTime} - {spot.closeTime}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-sm text-gray-600">{spot.description}</p>

                                                    {spotIndex < day.spotDescription.length - 1 && spot.toNextSpotDescription.map((transport, transportIndex) => (
                                                        <div key={transportIndex} 
                                                            className="flex items-center gap-3 text-sm bg-background/60 p-3 rounded border border-border/50">
                                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                                                <span className="text-lg">
                                                                    {transport.goType === '公交' ? '🚌' : 
                                                                     transport.goType === '地铁' ? '🚇' : 
                                                                     transport.goType === '步行' ? '🚶' : '🚗'}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium">{transport.goType}</p>
                                                                <p className="text-xs text-gray-500">约 {transport.time} · {transport.price}</p>
                                                            </div>
                                                            <div className="text-primary">
                                                                <ArrowRight size={16} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
