/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-19 21:08:57
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-21 09:04:46
 * @FilePath: \dalieba\app\newplan\[planid]\page.tsx
 * @Description: new plan page
 */

'use client'

import * as React from 'react'
import MapComponent from '@/components/map/MapComponent'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { AnimatePresence } from 'motion/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import SpotCard, { SpotCardProps } from '@/components/plan/spot-card'
import { useState, useEffect } from 'react'
import { ChevronDown, ArrowRight, Pencil, Plus } from 'lucide-react'
import MarkdownRenderer from '@/components/plan/markdown'
import { Input } from '@/components/ui/input'
import ControlBar from '@/components/ui/control-bar'
import TimeLine, { TimeLineItem } from '@/components/plan/time-line'
import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function NewPlanPage(
  {
    params
  }: {
    params: {
      planid: string
    }
  }
) {
    const [selectedMarker, setSelectedMarker] = React.useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [DayPlanItem, setDayPlanItem] = useState<SpotCardProps['DayPlan']>([]);
    const [activeTimelineItem, setActiveTimelineItem] = useState<string | number | undefined>(undefined);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const timelineItems: TimeLineItem[] = [
      {
        id: '1',
        day: 1,
        spots: [
          {
            id: '1',
            title: '哈尔滨工业大学',
            description: '参观校园主要景点',
            date: '9:00 - 11:00',
            thumbnail: '/images/hit.jpg',
            transport: {
              type: '打车',
              duration: '20',
              cost: '30'
            }
          },
          {
            id: '2',
            title: '中央大街',
            description: '漫步百年商业街',
            date: '11:30 - 13:30',
            thumbnail: '/images/central-street.jpg',
            transport: {
              type: '步行',
              duration: '15',
              cost: '0'
            }
          }
        ]
      },
      {
        id: '2',
        day: 2,
        spots: [
          {
            id: '3',
            title: '索菲亚教堂',
            description: '欣赏拜占庭建筑',
            date: '14:00 - 15:30',
            thumbnail: '/images/sophia-church.jpg',
            transport: {
              type: '地铁',
              duration: '25',
              cost: '4'
            }
          },
          {
            id: '4',
            title: '防洪纪念塔',
            description: '城市地标建筑',
            date: '16:00 - 17:30',
            thumbnail: '/images/flood-tower.jpg'
          }
        ]
      }
    ];
    const testItem = {
      spotDescription: [ // 景点描述
        {
          name: '哈尔滨工业大学', // 景点名称
          street: '哈尔滨工业大学123', // 景点地址
          description: '哈尔滨工业大学123', // 景点描述
          image: 'https://img-blog.csdnimg.cn/7ab12a17f5e0433fba325d665a4c0827.png', // 景点图片
          openTime: '哈尔滨工业大学123', // 景点开放时间
          closeTime: '哈尔滨工业大学123', // 景点关闭时间
          toNextSpotDescription: [
            {
              goType: '公交', // 交通工具
              time: '1小时', // 所需时间
              price: '10元' // 费用
            }
          ]
        }
      ]
    };

    useEffect(() => {
      setDayPlanItem([testItem]); // 设置景点描述
    }, []);

    const markdown = `
# 哈尔滨工业大学

哈尔滨工业大学（Harbin Institute of Technology）是中国著名的理工科大学，位于黑龙江省哈尔滨市。

## 基本信息
- 创建时间：1920年
- 地址：哈尔滨市南岗区西大直街92号
- 类型：理工类综合性大学

## 特色景点
1. 主楼
2. 图书馆
3. 校史馆
4. 主广场

> 这里是中国最早的理工科大学之一，拥有悠久的历史和深厚的文化底蕴。
    `

    const markers = [
      {
        position: [45.74331, 126.63108] as [number, number],
        title: '哈尔滨工业大学',
        popup: '哈尔滨工业大学',
        description: '哈尔滨工业大学123',
        icon: {
          url: '/images/location.svg',
          size: [32, 32] as [number, number],
        },
      }
    ]
    return (
        <div className="flex flex-col w-full h-screen overflow-hidden">
            <MapComponent 
              className='w-full h-full' 
              center={[45.74331, 126.63108]}
              layOutisPoints={false}
              showZoomLevel={false}
              maxZoom={16}
              minZoom={13}
              selectedMarker={selectedMarker}
              onMarkerClose={() => setSelectedMarker(null)}
              titleMaxZoom={17}
              titleMinZoom={14}
              markers={markers}
            />
            <ControlBar />

            <motion.div 
              className='mb-4 fixed top-4 left-4 bottom-4 w-[400px] z-999 rounded-lg flex flex-col gap-4'
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <details 
                className='group [&_summary::-webkit-details-marker]:hidden'
                open={isOpen}
                onClick={(e) => {
                  // 防止 details 的默认行为
                  e.preventDefault();
                  setIsOpen(!isOpen);
                }}
              >
                <summary className='cursor-pointer bg-background/70 backdrop-blur-sm rounded-lg list-none group-open:rounded-b-none overflow-y-auto'>
                    <div className='px-4 py-3 rounded-lg transition-colors bg-background/40 group-open:rounded-b-none group-open:border-b-border group-open:border-b-1'>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-1'>
                          <p className='font-medium'>AI 全部回复</p>
                          <p className='text-sm text-gray-500'>title</p>
                        </div>
                        <div className='text-primary transform transition-transform duration-300 group-open:-rotate-180'>
                          <ChevronDown />
                        </div>
                      </div>
                    </div>
                </summary>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.3 },
                        opacity: { duration: 0.2 }
                      }}
                      className={cn("overflow-hidden bg-background/70 backdrop-blur-sm rounded-lg group-open:rounded-t-none")}
                    >
                      <div className='px-4 pb-4 pt-2 bg-background/40 rounded-b-lg h-[400px] overflow-y-auto'>
                        <motion.div
                          className='pt-3'
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <MarkdownRenderer content={markdown} />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </details>
            </motion.div>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <motion.div
                  className='fixed bottom-4 -translate-x-1/2 left-1/2 z-999 bg-background/90 backdrop-blur-sm text-foreground hover:bg-background/90 hover:text-foreground'
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button className='fixed bottom-4 -translate-x-1/2 left-1/2 z-999 bg-background/90 backdrop-blur-sm text-foreground hover:bg-background/90 hover:text-foreground'>
                    查看攻略
                  </Button>
                </motion.div>
              </DrawerTrigger>
              <DrawerContent className='z-999 h-[400px] bg-background/90 backdrop-blur-sm'>
                <DrawerHeader>
                  <DrawerTitle>旅游攻略 - 哈尔滨</DrawerTitle>
                  <DrawerDescription>关于哈尔滨的旅游攻略</DrawerDescription>
                </DrawerHeader>
                <div className='px-6'>
                  {isDrawerOpen && (
                    <TimeLine 
                      items={timelineItems}
                      direction="horizontal"
                      activeId={activeTimelineItem}
                      onItemClick={(item) => {
                        setActiveTimelineItem(item.id);
                      }}
                      className="w-full"
                    />
                  )}
                </div>
                <DrawerFooter>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
        </div>
    )
}
