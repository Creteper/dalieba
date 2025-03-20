/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-19 21:08:57
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-20 09:46:40
 * @FilePath: \dalieba\app\newplan\[planid]\page.tsx
 * @Description: new plan page
 */

'use client'

import * as React from 'react'
import MapComponent from '@/components/map/MapComponent'

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

    return (
        <div className="flex flex-col w-full h-screen overflow-hidden">
            <MapComponent 
              className='w-full h-full' 
              center={[45.778624, 126.617726]}
              layOutisPoints={true}
              showZoomLevel={true}
              maxZoom={18}
              minZoom={12}
              selectedMarker={selectedMarker}
              onMarkerClose={() => setSelectedMarker(null)}
              titleMaxZoom={17}
              titleMinZoom={14}
              markers={[
                {
                  position: [45.778624, 126.617726],
                  title: '哈尔滨工业大学',
                  popup: '哈尔滨工业大学',
                  description: '哈尔滨工业大学123',
                  icon: {
                    url: '/images/location.svg',
                    size: [32, 32],
                  },
                }
              ]}
            />
        </div>
    )
}
