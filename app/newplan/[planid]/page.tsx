/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-19 21:08:57
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-21 16:09:58
 * @FilePath: \dalieba\app\newplan\[planid]\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-19 21:08:57
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-21 13:48:40
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
import { splitPos, extractPolylines, mergePolylines, processRouteToCoordinates } from '@/lib/pos-split'
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { devData } from '@/lib/dev-data'
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
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [markers, setMarkers] = useState<Array<{
      position: [number, number];
      title: string;
      popup: string;
      description: string;
      icon: {
        url: string;
        size: [number, number];
      };
    }>>([]);
    const [mapCenter, setMapCenter] = useState<[number, number]>([45.74331, 126.63108]);
    const [isSetTitleDrawerOpen, setIsSetTitleDrawerOpen] = useState(false);
    const [title, setTitle] = useState('旅游攻略 - 哈尔滨');
    const [positions, setPositions] = useState<Array<{
      latitude: number;
      longitude: number;
    }>>([]);
    const [routes, setRoutes] = useState<Array<{
      positions: [number, number][],
      color?: string,
      weight?: number,
      opacity?: number,
      dashArray?: string
    }>>([]);
    const timelineItems: TimeLineItem[] = [
      {
        id: '1',
        day: 1,
        spots: [
          {
            id: '1',
            title: '圣·索菲亚教堂',
            description: '参观教堂',
            date: '9:00 - 11:00',
            street: '黑龙江省哈尔滨市道里区透笼街88号圣·索菲亚教堂',
            thumbnail: '/images/djt.jpeg',
            position: {
              latitude: 45.770125,
              longitude: 126.627215
            },
            transport: {
              type: '打车',
              duration: '20分钟',
              cost: '¥30'
            }
          },
          {
            id: '2',
            title: '中央大街',
            description: '漫步百年商业街',
            date: '11:30 - 13:30',
            street: '黑龙江省哈尔滨市道里区中央大街1号哈尔滨中央大街',
            thumbnail: '/images/zydj.jpg',
            position: {
              latitude: 45.774835,
              longitude: 126.617682
            },
            transport: {
              type: '地铁',
              duration: '15分钟',
              cost: '¥4'
            }
          },
          {
            id: '3',
            title: '维也纳国际酒店',
            description: '入住酒店',
            date: '13:30 - 15:00',
            street: '北兴街55号悦城H15栋8-15层',
            thumbnail: '/images/jd.jpg',
            position: {
              latitude: 45.706189,
              longitude: 126.590348
            },
            transport: {
              type: '步行',
              duration: '15分钟',
              cost: '¥0'
            }
          },
          {
            id: '4',
            title: '哈尔滨松花江公路大桥',
            description: '欣赏松花江美景',
            date: '14:00 - 15:30',
            street: '黑龙江省哈尔滨市松北区松北区哈尔滨松花江公路大桥',
            thumbnail: '/images/dq.png',
            position: {
              latitude: 45.766351,
              longitude: 126.586364
            },
            transport: {
              type: '打车',
              duration: '10分钟',
              cost: '¥10'
            }
          },
          {
            id: '5',
            title: '哈尔滨太阳岛',
            description: '参观太阳岛',
            date: '9:00 - 11:00',
            street: '黑龙江省哈尔滨市松北区雪乡街与冰峰路交叉口南260米太阳岛绿色运动公园',
            thumbnail: '/images/sd.png',
            position: {
              latitude: 45.772135, 
              longitude: 126.571046
            },
            transport: {
              type: '打车',
              duration: '10分钟',
              cost: '¥10'
            }
          }
        ]
      },
      {
        id: '2',
        day: 2,
        spots: [
          {
            id: '6',
            title: '澜亭水汇',
            description: '尝试东北洗浴',
            date: '16:00 - 17:30',
            street: '黑龙江省哈尔滨市道里区澜亭水汇',
            thumbnail: '/images/sh.png',
            position: {
              latitude: 45.78116, 
              longitude: 126.63202
            }
          },
          {
            id: '7',
            title: '老厨家(中央大街店)',
            description: '品尝地道东北菜',
            date: '11:30 - 13:30',
            street: '黑龙江省哈尔滨市道里区中央大街1号哈尔滨中央大街',
            thumbnail: '/images/lcj.png',
            position: {
              latitude: 45.775947,
              longitude: 126.619297
            },
            transport: {
              type: '打车',
              duration: '10分钟',
              cost: '¥10'
            }
          },
          {
            id: '8',
            title: '中华巴洛克风情街',
            description: '参观中华巴洛克风情街',
            date: '14:00 - 15:30',
            street: '黑龙江省哈尔滨市道里区中华巴洛克风情街',
            thumbnail: '/images/zj.png',
            position: {
              latitude: 45.781791,
              longitude: 126.640729
            },
            transport: {
              type: '打车',
              duration: '10分钟',
              cost: '¥10'
            }
          },
          {
            id: '9',
            title: '哈尔滨西站',
            description: '乘坐火车离开哈尔滨',
            date: '15:30 - 17:00',
            street: '哈尔滨市南岗区哈尔滨大街501号',
            thumbnail: '/images/hx.png',
            position: {
              latitude: 45.707626,
              longitude: 126.575964
            }
          }
          
        ]
      }
    ];
    useEffect(() => {
      
      // 处理所有标记点
      const newMarkers: Array<{
        position: [number, number];
        title: string;
        popup: string;
        description: string;
        icon: {
          url: string;
          size: [number, number];
        };
      }> = [];
      
      // 图标配置
      const defaultIcon = {
        url: '/images/location.svg',
        size: [32, 32] as [number, number],
      };

      const dayTwoIcon = {
        url: '/images/black_marker.svg',
        size: [32, 32] as [number, number],
      };
      
      // 处理所有天数的所有景点
      timelineItems.forEach(day => {
        day.spots.forEach(spot => {
          newMarkers.push({
            position: [spot.position.latitude, spot.position.longitude] as [number, number],
            title: spot.title,
            popup: spot.title,
            description: spot.description,
            icon: day.day === 1 ? defaultIcon : dayTwoIcon,
          });
        });
      });
      
      // 更新标记点
      setMarkers(newMarkers);
      
      // 如果有标记点，以第一个为中心
      if (newMarkers.length > 0) {
        setMapCenter(newMarkers[0].position);
      }

      const _Pos = splitPos(devData.polyline);
      setPositions(_Pos);

      const _polyline = extractPolylines(devData.secoundLine);
      const _mergePolyline = mergePolylines(_polyline);
      const _mergePos = splitPos(_mergePolyline);
      setPositions(_Pos.concat(_mergePos));

      const _polyline2 = extractPolylines(devData.thirdLine);
      const _mergePolyline2 = mergePolylines(_polyline2);

      const _routes = processRouteToCoordinates(devData.thirdLine);
      const __routes = processRouteToCoordinates(devData.fourLine)
      const ___routes = processRouteToCoordinates(devData.fiveLine);
      const ____routes = processRouteToCoordinates(devData.sixLine);
      const _____routes = processRouteToCoordinates(devData.sevenLine);

      setRoutes([
        {
          positions: _routes,
          color: '#3B82F6',
          weight: 6,
          opacity: 1,
          dashArray: '10, 10'
        },{
          positions: __routes,
          color: '#3B82F6',
          weight: 6,
          opacity: 1,
          dashArray: '10, 10'
        },{
          positions: ___routes,
          color: '#000000',
          weight: 6,
          opacity: 0.67,
          dashArray: '10, 10'
        },{
          positions: ____routes,
          color: '#000000',
          weight: 6,
          opacity: 0.67,
          dashArray: '10, 10'
        },{
          positions: _____routes,
          color: '#000000',
          weight: 6,
          opacity: 0.67,
          dashArray: '10, 10'
        }
      ]);


    }, []);

    // 处理点击时间线项目
    const handleTimelineItemClick = (spot: TimeLineItem['spots'][0], position: { latitude: number, longitude: number }) => {
      setActiveTimelineItem(spot.id);
      setMapCenter([position.latitude, position.longitude]);
    };

    const markdown = `
# 哈尔滨两天一晚旅游计划

哈尔滨是中国东北地区的重要城市，以其独特的冰雪文化和美丽的自然风光而闻名。以下是哈尔滨两天一晚的旅游计划：

## 第一天

### 上午

    1. 圣·索菲亚教堂
    2. 中央大街
    3. 维也纳国际酒店

### 下午

    1. 哈尔滨松花江公路大桥
    2. 澜亭水汇

## 第二天

### 上午

    1. 哈尔滨太阳岛
    2. 老厨家(中央大街店)

### 下午

    1. 中华巴洛克风情街
    2. 哈尔滨西站

## 特色景点
1. 圣·索菲亚教堂
2. 中央大街
3. 哈尔滨松花江公路大桥
4. 澜亭水汇
5. 哈尔滨冰雪大世界
6. 哈尔滨太阳岛
7. 中华巴洛克风情街
8. 老厨家(中央大街店)

> 这里是中国最早的理工科大学之一，拥有悠久的历史和深厚的文化底蕴。
    `



    return (
        <div className="flex flex-col w-full h-screen overflow-hidden">
            <MapComponent 
              className='w-full h-full' 
              center={mapCenter}
              layOutisPoints={true}
              showZoomLevel={false}
              maxZoom={19}
              minZoom={0}
              selectedMarker={selectedMarker}
              onMarkerClose={() => setSelectedMarker(null)}
              titleMaxZoom={17}
              titleMinZoom={14}
              markers={markers}
              routes={[
                {
                  positions: positions.map(pos => [pos.latitude, pos.longitude] as [number, number]),
                  color: '#3B82F6',
                  weight: 6,
                  opacity: 1,
                  dashArray: '10, 10'
                },
                ...routes
              ]}
            />
            <ControlBar className='z-999' />
            <div className='fixed top-4 left-4 z-999 text-2xl font-bold text-black flex gap-4 items-center'>
              <img src="/images/logo.svg" alt="GO TOGETHER!" className="w-8 h-8" />
              GO! TOGETHER
            </div>
            <motion.div 
              className='mb-4 fixed top-15 left-4 right-4 md:w-[400px]  z-50 rounded-lg flex flex-col gap-45'
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
                <summary className='cursor-pointer bg-background/70 backdrop-blur-sm rounded-lg list-none group-open:rounded-b-none'>
                    <div className='px-4 py-3 rounded-lg transition-colors bg-background/40 group-open:rounded-b-none group-open:border-b-border group-open:border-b-1'>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-1'>
                          <p className='font-medium truncate'>AI 全部回复</p>
                          <p className='text-sm text-gray-500 truncate'>{ title }</p>
                        </div>
                        <div className='text-primary transform transition-transform duration-300 group-open:-rotate-180 flex-shrink-0 ml-2'>
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
                      <div className='px-4 pb-4 pt-2 bg-background/40 rounded-b-lg md:h-[400px] h-[300px] overflow-y-auto'>
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
                  <DrawerTitle 
                    className='flex items-center gap-2'
                    onClick={() => {
                      setIsSetTitleDrawerOpen(true)
                      setIsDrawerOpen(false)
                    }}
                  >{ title} <Pencil className='w-4 h-4 inline-block' /></DrawerTitle>
                  <DrawerDescription>关于哈尔滨的旅游攻略</DrawerDescription>
                </DrawerHeader>
                {/* 手机端 */}
                <div className='block md:hidden px-6 overflow-auto pb-4' style={{ scrollbarWidth: 'thin' }}>
                  {isDrawerOpen && (
                    <TimeLine 
                      items={timelineItems}
                      direction="vertical"
                      activeId={activeTimelineItem}
                      onItemClick={handleTimelineItemClick}
                      className="w-full pb-8"
                    />
                  )}
                </div>
                
                {/* 电脑端 */}
                <div className='hidden md:block px-6 overflow-x-auto overflow-y-hidden pb-4' style={{ scrollbarWidth: 'thin' }}>
                  {isDrawerOpen && (
                    <TimeLine 
                      items={timelineItems}
                      direction="horizontal"
                      activeId={activeTimelineItem}
                      onItemClick={handleTimelineItemClick}
                      className="w-full min-w-fit"
                    />
                  )}
                </div>
                <DrawerFooter>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Dialog open={isSetTitleDrawerOpen} onOpenChange={setIsSetTitleDrawerOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>修改标题</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <Input type="text" placeholder="请输入攻略标题" value={title} onChange={(e) => setTitle(e.target.value)} />
                </DialogDescription>
                <DialogFooter>
                  <Button onClick={() => {
                    setIsSetTitleDrawerOpen(false)
                    setIsDrawerOpen(true)
                  }}>确定</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
    )
}
