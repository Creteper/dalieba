'use client'

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Polyline } from 'react-leaflet'
import { Icon, Marker as LeafletMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cn } from '@/lib/utils'  

// ZoomDisplay组件定义
function ZoomDisplay() {
    const map = useMap();
    const [currentZoom, setCurrentZoom] = React.useState(map.getZoom());

    React.useEffect(() => {
        const updateZoom = () => {
            setCurrentZoom(map.getZoom());
        };

        map.on('zoom', updateZoom);

        return () => {
            map.off('zoom', updateZoom);
        };
    }, [map]);

    return (
        <div className="leaflet-bottom leaflet-left bottom-0! left-0!">
            <div className="rounded-sm bg-background/80 backdrop-blur-sm px-2 py-1 shadow-md rounded-l-none rounded-r-none rounded-tr-sm">
                缩放级别: {parseInt(currentZoom.toString())}
            </div>
        </div>
    );
}

// 创建ChangeView组件以监听和更新地图中心点
function ChangeView({
    center,
    zoom,
    onViewChange
}: {
    center: [number, number],
    zoom: number,
    onViewChange?: () => void
}) {
    const map = useMap();
    const prevCenter = React.useRef(center);
    const prevZoom = React.useRef(zoom);

    React.useEffect(() => {
        if (
            prevCenter.current[0] !== center[0] ||
            prevCenter.current[1] !== center[1] ||
            prevZoom.current !== zoom
        ) {
            // 使用flyTo而不是setView以获得平滑的动画效果
            map.flyTo(center, zoom, {
                duration: 2, // 2秒的动画时间
                easeLinearity: 0.5
            });
            // 触发视图改变回调
            onViewChange?.();

            // 更新前一次的值
            prevCenter.current = center;
            prevZoom.current = zoom;
        }
    }, [center, zoom, map, onViewChange]);

    return null;
}

interface CustomPopupProps {
    content: string
    description: string
    position: { x: number; y: number }
    onClose: () => void
}

function CustomPopup({ content, description, position, onClose }: CustomPopupProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <>
            <div
                className="fixed inset-0 z-[999]"
                onClick={onClose}
            />
            <div
                className="absolute z-[1000] transform -translate-x-1/2 -translate-y-full"
                style={{
                    left: position.x,
                    top: position.y - 8,
                }}
                onClick={handleClick}
            >
                <div className="relative">
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg pt-2 px-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start justify-between">
                                <span className="text-sm font-medium">{content}</span>
                            </div>
                            <p className="text-sm text-gray-500 pb-2">
                                {description}
                            </p>
                        </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 border-8 border-transparent border-t-background/80 backdrop-blur-sm" style={{ bottom: '-16px' }} />
                </div>
            </div>
        </>
    )
}

// 自定义图标配置
const customIcon = new Icon({
    iconUrl: '/images/location.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
})

// 添加地图事件监听组件
function MapEvents({ onDragStart, onDragEnd }: { onDragStart?: () => void, onDragEnd?: () => void }) {
    const map = useMap();

    React.useEffect(() => {
        if (!map) return;

        map.on('dragstart', () => {
            onDragStart?.();
        });

        map.on('dragend', () => {
            onDragEnd?.();
        });

        return () => {
            map.off('dragstart');
            map.off('dragend');
        };
    }, [map, onDragStart, onDragEnd]);

    return null;
}

interface MapImplProps {
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
    onDragStart?: () => void
    onDragEnd?: () => void
    layOutisPoints?: boolean
    positions?: [number, number][]
    selectedMarker?: number | null
    onMarkerClose?: () => void
}

function MapImpl({
    center = [45.75, 126.63],
    zoom = 13,
    maxZoom = 15,
    minZoom = 10,
    markers = [],
    showZoomLevel = true,
    className,
    onDragStart,
    onDragEnd,
    layOutisPoints = true,
    positions = [],
    selectedMarker = null,
    onMarkerClose
}: MapImplProps) {
    const [selectedMarkerInfo, setSelectedMarkerInfo] = useState<{
        content: string;
        description: string;
        position: { x: number; y: number };
    } | null>(null);

    // 处理标记点击
    const handleMarkerClick = (e: L.LeafletMouseEvent, content: string, description: string) => {
        const { containerPoint } = e;
        setSelectedMarkerInfo({
            content,
            description,
            position: {
                x: containerPoint.x,
                y: containerPoint.y
            }
        });
    };

    // 处理视图改变
    const handleViewChange = () => {
        setSelectedMarkerInfo(null);
        onMarkerClose?.();
    };

    // 自动显示选中的标记
    useEffect(() => {
        if (selectedMarker !== null && markers[selectedMarker]) {
            const marker = markers[selectedMarker];
            const map = document.querySelector('.leaflet-container');
            if (map) {
                const rect = map.getBoundingClientRect();
                setSelectedMarkerInfo({
                    content: marker.popup || '',
                    description: marker.description || '',
                    position: {
                        x: rect.width / 2,
                        y: rect.height / 2
                    }
                });
            }
        } else {
            setSelectedMarkerInfo(null);
        }
    }, [selectedMarker, markers]);

    return (
        <div className={cn("h-full w-full relative", className)}>
            <MapContainer
                center={center}
                zoom={zoom}
                maxZoom={maxZoom}
                minZoom={minZoom}
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
            >
                <ChangeView center={center} zoom={zoom} onViewChange={handleViewChange} />
                <MapEvents onDragStart={onDragStart} onDragEnd={onDragEnd} />

                <TileLayer
                    attribution='&copy; 大列巴地图服务'
                    url={layOutisPoints ? 'http://192.168.200.66:3000/tiles/{z}/{x}/{y}/x={x}&y={y}&z={z}.png' : 'http://192.168.200.66:3000/w_tiles/{z}/{x}/{y}/x={x}&y={y}&z={z}.png'}
                />
                <Polyline positions={positions}
                    pathOptions={{
                        weight: 6
                    }}
                />
                {showZoomLevel && <ZoomDisplay />}

                {markers.map((marker, idx) => (
                    <Marker
                        key={idx}
                        position={marker.position}
                        icon={customIcon}
                        eventHandlers={{
                            click: (e) => marker.popup && handleMarkerClick(e, marker.popup, marker.description || ''),
                        }}
                    />
                ))}
            </MapContainer>

            {selectedMarkerInfo && (
                <CustomPopup
                    content={selectedMarkerInfo.content}
                    description={selectedMarkerInfo.description}
                    position={selectedMarkerInfo.position}
                    onClose={() => {
                        setSelectedMarkerInfo(null);
                        onMarkerClose?.();
                    }}
                />
            )}
        </div>
    )
}

export default MapImpl 