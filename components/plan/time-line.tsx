/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-20 20:25:28
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-21 11:03:06
 * @FilePath: \dalieba\components\plan\time-line.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'

import { cn } from "@/lib/utils";
import { ArrowRight, Clock, MapPin, Calendar, DollarSign, Bus, Train, Car, Footprints } from "lucide-react";
import Image from "next/image";

export interface TimeLineItem {
  id: string | number // 唯一标识
  day: number // 第几天
  spots: {
    id: string | number // 唯一标识
    title: string // 标题
    description: string // 描述
    street: string // 街道
    date: string // 日期
    thumbnail: string // 缩略图
    position: {
      latitude: number // 纬度
      longitude: number // 经度
    }
    transport?: {
      type: string // 交通工具
      duration: string // 所需时间
      cost: string // 费用
    }
  }[]
}

// 获取交通方式图标
function getTransportIcon(type: string) {
  switch(type.toLowerCase()) {
    case '公交':
    case '巴士':
    case '大巴':
      return <Bus className="w-3 h-3" />;
    case '地铁':
    case '轻轨':
    case '火车':
      return <Train className="w-3 h-3" />;
    case '打车':
    case '出租车':
    case '私家车':
      return <Car className="w-3 h-3" />;
    case '步行':
    case '徒步':
      return <Footprints className="w-3 h-3" />;
    default:
      return <Car className="w-3 h-3" />;
  }
}

export default function TimeLine(
  { items, direction, activeId, onItemClick, className }: 
  { items: TimeLineItem[], 
    direction: 'horizontal' | 'vertical', 
    activeId: string | number | undefined, 
    onItemClick: (item: TimeLineItem['spots'][0], position: { latitude: number, longitude: number }) => void, 
    className: string 
  }) {
  // 水平布局
  if (direction === 'horizontal') {
    return (
      <div className={cn('flex flex-row overflow-x-auto pb-4 gap-8', className)}>
        {items.map((dayItem) => (
          <div key={dayItem.id} className="flex-shrink-0">
            <div className="flex flex-col gap-4 min-w-[320px]">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  {dayItem.day}
                </div>
                <span className="text-foreground">Day {dayItem.day}</span>
              </h1>
              <div className="flex flex-row overflow-x-auto pb-2 gap-4">
                {dayItem.spots.map((spot, spotIndex) => (
                  <div key={spot.id} className="flex flex-row items-center">
                    <div 
                      className={cn(
                        "bg-background/50 rounded-md w-48 h-48 flex-shrink-0 flex flex-col overflow-hidden",
                        activeId === spot.id ? "border-2 border-primary" : "border border-border/40",
                        "cursor-pointer transition-all hover:border-2 hover:border-primary"
                      )}
                      onClick={() => onItemClick(spot, spot.position)}
                    >
                      <div className="w-full h-28 relative">
                        {spot.thumbnail && (
                          <div 
                            className="absolute inset-0 bg-cover bg-center" 
                            style={{ backgroundImage: `url('${spot.thumbnail}')` }}
                          />
                        )}
                      </div>
                      <div className="w-full p-2 flex flex-col overflow-hidden">
                        <p className="font-bold text-sm leading-tight truncate">{spot.title}</p>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" /> 
                          <span className="truncate">{spot.street}</span>
                        </p>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 flex-shrink-0" /> 
                          <span className="truncate">{spot.date}</span>
                        </p>
                      </div>
                    </div>
                    
                    {spotIndex !== dayItem.spots.length - 1 && (
                      <div className="flex items-center justify-center p-2 mx-1">
                        <div className="flex flex-col gap-2 items-center bg-background/40 rounded-md p-2 w-full overflow-hidden">
                          <p className="text-xs font-medium text-primary truncate w-full text-center flex items-center justify-center gap-1">
                            {getTransportIcon(spot.transport?.type || '步行')}
                            <span className="truncate">{spot.transport?.type || '步行'}</span>
                          </p>
                          <div className="flex items-center gap-1 w-full justify-center">
                            <Line className="w-12"/>
                            <ArrowRight className="w-3 h-3 text-primary"/>
                          </div>
                          <div className="flex flex-col items-center gap-1 w-full">
                            <span className="bg-background/70 px-1.5 py-0.5 rounded flex items-center gap-1 truncate max-w-full">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{spot.transport?.duration || '--'}</span>
                            </span>
                            {spot.transport?.cost && (
                              <span className="text-yellow-500 bg-background/70 px-1.5 py-0.5 rounded flex items-center gap-1 truncate max-w-full mt-1">
                                <span className="truncate">{spot.transport.cost}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // 垂直布局
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {items.map((dayItem) => (
        <div key={dayItem.id} className="border-l-2 border-primary/20 pl-6 relative">
          <div className="absolute -left-3 top-0">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-background font-medium text-sm">
              {dayItem.day}
            </div>
          </div>
          
          <h1 className="text-xl font-bold mb-4">Day {dayItem.day}</h1>
          
          <div className="flex flex-col gap-4">
            {dayItem.spots.map((spot, spotIndex) => (
              <div key={spot.id} className="relative">
                <div className="absolute -left-[30px] top-6">
                  <div className={cn(
                    "w-3 h-3 rounded-full bg-background border-2",
                    activeId === spot.id ? "border-primary" : "border-muted-foreground"
                  )}></div>
                </div>
                
                <div 
                  className={cn(
                    "flex items-start bg-background/50 rounded-md overflow-hidden border",
                    activeId === spot.id ? "border-primary" : "border-border/40",
                    "cursor-pointer transition-all hover:border-primary"
                  )}
                  onClick={() => onItemClick(spot, spot.position)}
                >
                  <div className="h-20 w-24 relative flex-shrink-0">
                    {spot.thumbnail && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url('${spot.thumbnail}')` }}
                      />
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1 overflow-hidden">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm">{spot.title}</p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">{spot.date}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" /> 
                      <span className="truncate">{spot.street}</span>
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{spot.description}</p>
                  </div>
                </div>
                
                {spotIndex !== dayItem.spots.length - 1 && (
                  <div className="ml-1 my-2 pl-[6px] border-l border-dashed border-muted">
                    {spot.transport && (
                      <div className="flex items-center gap-2 py-2 px-4 bg-background/30 rounded-md text-xs text-muted-foreground">
                        <div className="flex items-center">
                          {getTransportIcon(spot.transport.type)}
                          <span className="ml-1">{spot.transport.type}</span>
                        </div>
                        <span>·</span>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {spot.transport.duration}
                        </div>
                        {spot.transport.cost && (
                          <>
                            <span>·</span>
                            <div className="flex items-center text-yellow-500">
                              {spot.transport.cost}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Line({ className }: { className?: string }) {
  return (
    <div className={cn('bg-border h-[1px] rounded-full', className)}></div>
  );
}

function Dot({ className }: { className?: string }) {
  return (
    <div className={cn('border-2 border-primary hover:w-3 hover:h-3 transition-all duration-300 h-2 w-2 rounded-full', className)}></div>
  );
}


