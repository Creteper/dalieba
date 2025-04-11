'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Polyline } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cn } from '@/lib/utils'
import { ServerConfig } from '@/lib/site'

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

// 添加图标创建工具函数
export function createIcon(options: {
    url: string,
    size?: [number, number],
    anchor?: [number, number],
    popupAnchor?: [number, number]
}) {
    return new Icon({
        iconUrl: options.url,
        iconSize: options.size || [32, 32],
        iconAnchor: options.anchor || [16, 32],
        popupAnchor: options.popupAnchor || [0, -32],
    })
}

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

// 添加地图点击事件处理组件
function MapClickHandler({ onClick }: { onClick?: (e: L.LeafletMouseEvent) => void }) {
    const map = useMap();

    React.useEffect(() => {
        if (!map || !onClick) return;

        map.on('click', onClick);

        return () => {
            map.off('click', onClick);
        };
    }, [map, onClick]);

    return null;
}

// 添加标题组件
function MarkerTitle({
    position,
    title,
    maxZoom = 18,
    minZoom = 15
}: {
    position: [number, number],
    title: string,
    maxZoom?: number,
    minZoom?: number
}) {
    const map = useMap();
    const [pixelPosition, setPixelPosition] = useState<L.Point | null>(null);
    const [currentZoom, setCurrentZoom] = useState(map.getZoom());

    useEffect(() => {
        const updatePosition = () => {
            try {
                const point = map.latLngToContainerPoint(position);
                setPixelPosition(point);
            } catch (error) {
                setPixelPosition(null);
            }
        };

        const updateZoom = () => {
            setCurrentZoom(map.getZoom());
        };

        // 初始化时更新一次
        updatePosition();
        updateZoom();

        map.on('zoom', () => {
            updatePosition();
            updateZoom();
        });
        map.on('move', updatePosition);
        // 添加 load 事件监听
        map.on('load', () => {
            updatePosition();
            updateZoom();
        });

        return () => {
            map.off('zoom');
            map.off('move', updatePosition);
            map.off('load');
        };
    }, [map, position]);

    if (currentZoom > maxZoom || currentZoom < minZoom || !pixelPosition) return null;

    return (
        <div
            className="absolute z-[999] transform -translate-x-1/2 text-center pointer-events-none whitespace-nowrap"
            style={{
                left: `${pixelPosition.x}px`,
                top: `${pixelPosition.y + 20}px`,
            }}
        >
            <span className="px-2 py-1 text-xs bg-background/60 backdrop-blur-sm rounded-full text-foreground">
                {title}
            </span>
        </div>
    );
}

interface MapImplProps {
    center?: [number, number]
    zoom?: number
    maxZoom?: number
    minZoom?: number
    titleMaxZoom?: number      // 标题最大显示缩放级别
    titleMinZoom?: number      // 添加标题最小显示缩放级别
    markers?: Array<{
        position: [number, number],
        popup?: string,
        description?: string,
        title?: string,
        icon?: {
            url: string,
            size?: [number, number],
            anchor?: [number, number],
            popupAnchor?: [number, number]
        } | Icon
    }>
    showZoomLevel?: boolean
    className?: string
    onDragStart?: () => void
    onDragEnd?: () => void
    layOutisPoints?: boolean
    positions?: [number, number][]
    routes?: Array<{
        positions: [number, number][],
        color?: string,
        weight?: number,
        opacity?: number,
        dashArray?: string
    }>
    selectedMarker?: number | null
    onMarkerClose?: () => void
    onMapClick?: (e: L.LeafletMouseEvent) => void
    onMarkerClick?: (marker: { position: [number, number], popup?: string, description?: string, title?: string }) => void
}

// 默认图标配置
const defaultIcon = createIcon({
    url: '/images/location.svg'
})

function MapImpl({
    center = [45.75, 126.63],
    zoom = 13,
    maxZoom = 15,
    minZoom = 10,
    titleMaxZoom = 15,
    titleMinZoom = 12,
    markers = [],
    showZoomLevel = true,
    className,
    onDragStart,
    onDragEnd,
    layOutisPoints = true,
    positions = [],
    routes = [],
    selectedMarker = null,
    onMarkerClose,
    onMapClick,
    onMarkerClick
}: MapImplProps) {
    const [hoveredMarker, setHoveredMarker] = useState<{
        content: string;
        description: string;
        position: { x: number; y: number };
    } | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mapRef = useRef<L.Map | null>(null);

    // 处理标记悬停
    const handleMarkerMouseOver = useCallback((e: L.LeafletMouseEvent, marker: { position: [number, number], popup?: string, description?: string, title?: string }) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        
        const { containerPoint } = e;
        setHoveredMarker({
            content: marker.popup || '',
            description: marker.description || '',
            position: {
                x: containerPoint.x,
                y: containerPoint.y
            }
        });
    }, []);

    // 处理标记离开
    const handleMarkerMouseOut = useCallback(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredMarker(null);
        }, 100);
    }, []);

    // 更新提示框位置
    const updatePopupPosition = useCallback(() => {
        if (!hoveredMarker || !mapRef.current) return;

        const marker = markers.find(m => m.popup === hoveredMarker.content);
        if (!marker) return;

        const point = mapRef.current.latLngToContainerPoint(marker.position);
        setHoveredMarker(prev => prev ? {
            ...prev,
            position: {
                x: point.x,
                y: point.y
            }
        } : null);
    }, [hoveredMarker, markers]);

    // 监听地图移动事件
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        map.on('move', updatePopupPosition);
        map.on('zoom', updatePopupPosition);

        return () => {
            map.off('move', updatePopupPosition);
            map.off('zoom', updatePopupPosition);
        };
    }, [updatePopupPosition]);

    // 清理定时器
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    // 处理图标配置
    const getMarkerIcon = (markerIcon?: NonNullable<MapImplProps['markers']>[number]['icon']) => {
        if (!markerIcon) return defaultIcon;
        if (markerIcon instanceof Icon) return markerIcon;
        return createIcon(markerIcon);
    };

    return (
        <div className={cn("h-full w-full relative z-40", className)}>
            <MapContainer
                center={center}
                zoom={zoom}
                maxZoom={maxZoom}
                minZoom={minZoom}
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <ChangeView center={center} zoom={zoom} onViewChange={onMarkerClose} />
                <MapEvents onDragStart={onDragStart} onDragEnd={onDragEnd} />
                <MapClickHandler onClick={onMapClick} />

                <TileLayer
                    attribution='&copy; GO！ TOGETHER'
                    url={layOutisPoints ? ServerConfig.mapApiUrl + 'tiles/{z}/{x}/{y}/x={x}&y={y}&z={z}.png' : ServerConfig.mapApiUrl + 'w_tiles/{z}/{x}/{y}/x={x}&y={y}&z={z}.png'}
                />

                {/* 渲染单条路线(向后兼容) */}
                {positions.length > 0 && (
                    <Polyline positions={positions}
                        pathOptions={{
                            weight: 6,
                            color: '#3B82F6'
                        }}
                    />
                )}

                {/* 渲染多条路线 */}
                {routes.map((route, index) => (
                    <Polyline
                        key={index}
                        positions={route.positions}
                        pathOptions={{
                            color: route.color || '#3B82F6',
                            weight: route.weight || 6,
                            opacity: route.opacity || 1,
                            dashArray: route.dashArray
                        }}
                    />
                ))}

                {showZoomLevel && <ZoomDisplay />}

                {markers.map((marker, idx) => (
                    <div key={idx} className="relative">
                        <Marker
                            position={marker.position}
                            icon={getMarkerIcon(marker.icon)}
                            eventHandlers={{
                                mouseover: (e: any) => handleMarkerMouseOver(e, marker),
                                mouseout: handleMarkerMouseOut,
                                click: (e: any) => onMarkerClick?.(marker),
                            }}
                        />
                        {marker.title && (
                            <MarkerTitle
                                position={marker.position}
                                title={marker.title}
                                maxZoom={titleMaxZoom}
                                minZoom={titleMinZoom}
                            />
                        )}
                    </div>
                ))}
            </MapContainer>

            {hoveredMarker && (
                <div
                    className="absolute z-[1000] transform -translate-x-1/2 -translate-y-full pointer-events-none"
                    style={{
                        left: hoveredMarker.position.x,
                        top: hoveredMarker.position.y - 8,
                    }}
                >
                    <div className="relative">
                        <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg pt-2 px-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-start justify-between">
                                    <span className="text-sm font-medium">{hoveredMarker.content}</span>
                                </div>
                                <p className="text-sm text-gray-500 pb-2">
                                    {hoveredMarker.description}
                                </p>
                            </div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 border-8 border-transparent border-t-background/80 backdrop-blur-sm" style={{ bottom: '-16px' }} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default MapImpl 