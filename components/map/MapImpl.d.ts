/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-18 20:18:31
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-19 09:01:18
 * @FilePath: \dalieba\components\map\MapImpl.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ComponentType } from 'react';

interface MapImplProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    position: [number, number],
    popup?: string
  }>
  showZoomLevel?: boolean
  className?: string
}

declare const MapImpl: ComponentType<MapImplProps>;
export default MapImpl; 