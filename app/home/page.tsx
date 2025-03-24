/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-22 13:16:50
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-22 13:52:55
 * @FilePath: \dalieba\app\home\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

'use client'

import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect } from "react"
import MapComponent from "@/components/map/MapComponent"
import ControlBar from "@/components/ui/control-bar"
export default function HomePage () {
  const isMobile = useIsMobile()
  useEffect(() => {
    console.log(isMobile)
  })
  return (
    <div className="w-full">
      <div className="w-full h-screen">
        <MapComponent
          showZoomLevel={false}
          className="w-full h-screen"
          center={[45.774835, 126.617682]}
        />
      </div>
      <nav className="w-full h-[60px] fixed bg-background/90 top-0 z-999 backdrop-blur-xl shadow-2xl flex border-b-2 border-border">
        <div className="flex items-center justify-center gap-2 ml-4">
          <img src="/images/logo.svg" className="w-8 h-8 object-cover" alt="GO! TOGETHER" />
          <p className="font-bold text-xl">GO! TOGETHER</p>
        </div>
        <ControlBar variant="outline" className="static ml-auto mr-4" />
      </nav>
      <div className="w-full absolute top-[250px] bg-background rounded-t-xl h-[3000px] z-[998]">

      </div>
    </div>
  )
}