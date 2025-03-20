/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-19 21:08:57
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-20 10:30:15
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

    const markers = [
      {
        position: [45.778624, 126.617726] as [number, number],
        title: '哈尔滨工业大学',
        popup: '哈尔滨工业大学',
        description: '哈尔滨工业大学123',
        icon: {
          url: '/images/location.svg',
          size: [32, 32] as [number, number],
        },
      }
    ]
    return (
        <div className="flex flex-col w-full h-screen overflow-hidden">
            <MapComponent 
              className='w-full h-full' 
              center={[45.778624, 126.617726]}
              layOutisPoints={true}
              showZoomLevel={false}
              maxZoom={18}
              minZoom={12}
              selectedMarker={selectedMarker}
              onMarkerClose={() => setSelectedMarker(null)}
              titleMaxZoom={17}
              titleMinZoom={14}
              markers={markers}
            />

            <motion.div
              className='fixed h-full w-96 z-999'
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className='bg-background/70 backdrop-blur-sm h-full rounded-none'>
                <CardHeader>
                  <CardTitle>哈尔滨工业大学</CardTitle>
                  <CardDescription>哈尔滨工业大学123</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='w-full h-[calc(100vh-11rem)]'>
                    <ScrollArea className='h-full'>

                    </ScrollArea>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <p>查看详情</p>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
        </div>
    )
}
