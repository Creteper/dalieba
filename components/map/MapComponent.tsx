'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import type { HTMLAttributes } from 'react'

// 动态导入 MapImpl 组件，禁用 SSR
const DynamicMap = dynamic(
  () => import('./MapImpl'),
  {
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-background/80">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    ),
    ssr: false
  }
)

// MapProps 接口定义
interface MapProps {
  center?: [number, number]
  zoom?: number
  maxZoom?: number
  minZoom?: number
  markers?: Array<{
    position: [number, number]
    popup?: string
    description?: string
  }>
  showZoomLevel?: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
  layOutisPoints?: boolean
  positions?: [number, number][]
  className?: string
  selectedMarker?: number | null
  onMarkerClose?: () => void
}

// 导出 MapComponent 组件
export default function MapComponent(props: MapProps) {
  return <DynamicMap {...props} />
} 