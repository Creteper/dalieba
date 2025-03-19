/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-18 19:41:13
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-18 19:43:56
 * @FilePath: \dalieba\app\map\layout.tsx
 * @Description: 地图页面布局
 */
'use client'

import React from 'react'

export default function MapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style jsx global>{`
        /* 确保地图容器能正确显示 */
        .leaflet-container {
          height: 100%;
          width: 100%;
        }
        
        /* 导入 Leaflet CSS */
        @import 'leaflet/dist/leaflet.css';
      `}</style>
      {children}
    </>
  )
} 