/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-19 13:17:51
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-20 09:32:11
 * @FilePath: \dalieba\components\map\MapComponent.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'

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
        title?: string
        icon?: {
            url: string
            size?: [number, number]
            anchor?: [number, number]
            popupAnchor?: [number, number]
        } | Icon

    }>
    titleMaxZoom?: number
    titleMinZoom?: number
    showZoomLevel?: boolean
    onDragStart?: () => void
    onDragEnd?: () => void
    layOutisPoints?: boolean
    positions?: [number, number][]
    routes?: Array<{
        positions: [number, number][]
        color?: string
        weight?: number
        opacity?: number
        dashArray?: string
    }>
    className?: string
    selectedMarker?: number | null
    onMarkerClose?: () => void
    onMapClick?: (e: L.LeafletMouseEvent) => void
    onMarkerClick?: (marker: { position: [number, number], popup?: string, description?: string, title?: string }) => void
}

// 导出 MapComponent 组件
export default function MapComponent(props: MapProps) {
    return <DynamicMap {...props} />
} 