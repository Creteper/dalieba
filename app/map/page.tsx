'use client'

import React from 'react'
import MapComponent from '@/components/map/MapComponent'
import ControlBar from '@/components/ui/control-bar'

export default function MapPage() {
  // 哈尔滨的一些地标
  const landmarks = [
    {
      position: [45.608868, 126.639431] as [number, number],
      popup: "哈尔滨极地公园"
    }
  ]

  return (
    <div className="min-h-screen w-full">
      <ControlBar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">哈尔滨地图</h1>
        
        <div className="rounded-lg overflow-hidden shadow-lg">
          <MapComponent 
            className="h-[70vh]" 
            markers={landmarks}
            center={[45.7563, 126.6353]}
            zoom={14}
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">景点列表</h2>
          <ul className="space-y-2">
            {landmarks.map((landmark, idx) => (
              <li key={idx} className="p-3 bg-card rounded-md shadow">
                {landmark.popup}
                <span className="text-sm text-muted-foreground ml-2">
                  ({landmark.position[0].toFixed(4)}, {landmark.position[1].toFixed(4)})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 