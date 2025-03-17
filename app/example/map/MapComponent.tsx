'use client'

import { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

export default function MapComponent() {
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        const loadMap = async () => {
            try {
                const AMap = await AMapLoader.load({
                    key: "8202a002a6aa596a0269506beb30fe27",
                    version: '2.0',
                    plugins: ['AMap.ToolBar', 'AMap.Scale']
                });

                // 创建地图实例
                const map = new AMap.Map('container', {
                    zoom: 11,
                    center: [116.397428, 39.90923]
                });

                // 添加工具条和比例尺
                map.addControl(new AMap.ToolBar());
                map.addControl(new AMap.Scale());

                // 保存引用
                mapRef.current = map;

                // 添加地图点击事件
                map.on('click', (e: any) => {
                    const lnglat = e.lnglat;
                    const position = [lnglat.getLng(), lnglat.getLat()];
                    
                    // 创建新标记点
                    const newMarker = new AMap.Marker({
                        position: position,
                        title: `标记点 ${markersRef.current.length + 1}`,
                        animation: 'AMAP_ANIMATION_DROP'
                    });
                    
                    // 添加标记点点击事件
                    newMarker.on('click', () => {
                        const markerIndex = markersRef.current.indexOf(newMarker) + 1;
                        alert(`点击了标记点 ${markerIndex}\n位置：${position[0]}, ${position[1]}`);
                    });

                    // 将标记点添加到地图
                    newMarker.setMap(map);
                    markersRef.current.push(newMarker);
                });

            } catch (error) {
                console.error('地图加载失败：', error);
            }
        };

        loadMap();

        // 清理函数
        return () => {
            if (mapRef.current) {
                // 清除所有标记点
                markersRef.current.forEach(marker => marker.setMap(null));
                mapRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="relative w-full h-screen">
            <div id="container" className="w-full h-full"></div>
            <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
                <h3 className="font-bold mb-2">地图功能说明：</h3>
                <ul className="text-sm">
                    <li>• 点击地图任意位置添加标记点</li>
                    <li>• 点击标记点查看详细信息</li>
                    <li>• 可以使用工具条进行缩放</li>
                </ul>
            </div>
        </div>
    );
} 