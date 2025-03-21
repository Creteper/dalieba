'use client'

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export interface TimeLineItem {
  id: string | number // 唯一标识
  day: number // 第几天
  spots: {
    id: string | number // 唯一标识
    title: string // 标题
    description: string // 描述
    date: string // 日期
    thumbnail: string // 缩略图
    transport?: {
      type: string // 交通工具
      duration: string // 所需时间
      cost: string // 费用
    }
  }[]
}

export default function TimeLine(
  { items, direction, activeId, onItemClick, className }: 
  { items: TimeLineItem[], 
    direction: 'horizontal' | 'vertical', 
    activeId: string | number | undefined, 
    onItemClick: (item: TimeLineItem['spots'][0]) => void, 
    className: string 
  }) {
  return (
    <div className={cn('flex items-center gap-8 overflow-x-auto overflow-y-hidden', className)}>
      {items.map((dayItem) => (
        <div key={dayItem.id} className="flex gap-4 flex-col min-w-[400px]">
          <h1 className="text-2xl font-bold">
            <span className="text-muted-foreground text-sm">Day</span> {dayItem.day}
          </h1>
          <div className="flex gap-4">
            {dayItem.spots.map((spot, spotIndex) => (
              <div key={spot.id} className="flex items-start gap-4" onClick={() => onItemClick(spot)}>
               
                
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
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


