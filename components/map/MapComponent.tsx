'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

// 地图相关属性
interface MapProps {
  center?: [number, number]
  zoom?: number
  maxZoom?: number
  minZoom?: number
  markers?: Array<{
    position: [number, number],
    popup?: string,
    description?: string
  }>
  showZoomLevel?: boolean
  className?: string
  onMapDragStart?: () => void
  onMapDragEnd?: () => void
  layOutisPoints?: boolean
  positions?: [number, number][]
}

// 整合DOM属性和地图属性
interface MapComponentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>, MapProps {}

// 动态导入Leaflet相关组件，禁用SSR
// 使用类型断言解决类型问题
const ClientMapComponent = dynamic(
  // @ts-ignore - 抑制模块未找到的错误
  () => import('./MapImpl'), 
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">加载地图中...</div>
      </div>
    )
  }
) as React.ComponentType<MapProps>;

export function MapComponent({
  className,
  style,
  center,
  zoom,
  maxZoom,
  minZoom,
  markers,
  showZoomLevel,
  onMapDragStart,
  onMapDragEnd,
  layOutisPoints,
  positions,
  ...otherProps
}: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // 添加短暂延迟以实现淡入效果
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const containerClass = cn(
    "fixed",
    "top-0",
    "left-0",
    "right-0",
    "bottom-0",
    "z-40",
    "user-select-none",
    "pointer-events-none",
    className
  )

  if (!isMounted) {
    return (
      <div 
        className={cn("h-96 bg-muted animate-pulse rounded-md overflow-hidden", className)} 
        style={style}
        {...otherProps} 
      />
    )
  }

  // 使用纯CSS过渡代替motion组件
  return (
    <div className={containerClass} style={style} {...otherProps}>
      <ClientMapComponent
        center={center}
        zoom={zoom}
        maxZoom={maxZoom}
        minZoom={minZoom}
        markers={markers}
        showZoomLevel={showZoomLevel}
        className={className}
        onMapDragStart={onMapDragStart}
        onMapDragEnd={onMapDragEnd}
        layOutisPoints={layOutisPoints}
        positions={positions}
      />
    </div>
  )
}

export default MapComponent 