# MapImpl 组件文档

`MapImpl` 是一个基于 Leaflet 的地图组件，提供了丰富的地图交互功能和自定义标记点展示能力。

## 功能特性

- 支持地图缩放和拖动
- 自定义标记点和弹出框
- 标记点标题显示
- 灵活的标记点图标配置
- 地图点击事件回调
- 路径绘制
- 平滑的视图切换动画
- 响应式设计
- 缩放级别显示

## 属性说明

```typescript
interface MapImplProps {
    center?: [number, number]        // 地图中心点坐标，默认 [45.75, 126.63]
    zoom?: number                    // 缩放级别，默认 13
    maxZoom?: number                 // 最大缩放级别，默认 15
    minZoom?: number                 // 最小缩放级别，默认 10
    markers?: Array<{               // 标记点数组
        position: [number, number],  // 标记点位置
        popup?: string,             // 弹出框内容
        description?: string,       // 描述信息
        title?: string,            // 标记点下方显示的标题
        icon?: {                   // 图标配置对象
            url: string,           // 图标URL
            size?: [number, number], // 图标尺寸 [宽度, 高度]
            anchor?: [number, number], // 图标锚点 [x, y]
            popupAnchor?: [number, number] // 弹出框锚点 [x, y]
        } | Icon                  // 或直接使用 Leaflet Icon 实例
    }>
    showZoomLevel?: boolean         // 是否显示缩放级别，默认 true
    className?: string             // 自定义类名
    onDragStart?: () => void      // 开始拖动回调
    onDragEnd?: () => void        // 结束拖动回调
    layOutisPoints?: boolean      // 是否使用带标注地图，默认 false
    positions?: [number, number][] // 路径点数组
    selectedMarker?: number | null // 选中的标记点索引
    onMarkerClose?: () => void    // 关闭标记点弹出框回调
    onMapClick?: (e: L.LeafletMouseEvent) => void  // 地图点击回调
}
```

## 子组件

### 1. ZoomDisplay
显示当前地图缩放级别的组件。

### 2. ChangeView
处理地图视图更新的组件，提供平滑的动画效果。

### 3. CustomPopup
自定义弹出框组件，用于显示标记点详细信息。

### 4. MapClickHandler
处理地图点击事件的组件。

## 使用示例

### 基本使用
```tsx
import MapImpl from '@/components/map/MapImpl'

function MyMap() {
  return (
    <MapImpl
      center={[45.75, 126.63]}
      zoom={13}
      markers={[
        {
          position: [45.75, 126.63],
          popup: "标记点1",
          description: "这是一个示例标记点",
          title: "地点名称"
        }
      ]}
    />
  )
}
```

### 使用不同的标记点图标
```tsx
import MapImpl, { createIcon } from '@/components/map/MapImpl'

function MyMap() {
  return (
    <MapImpl
      markers={[
        {
          position: [45.75, 126.63],
          popup: "商店",
          icon: {
            url: '/images/shop.svg',
            size: [40, 40]
          }
        },
        {
          position: [45.76, 126.64],
          popup: "餐厅",
          icon: {
            url: '/images/restaurant.svg',
            size: [32, 32]
          }
        },
        {
          position: [45.77, 126.65],
          popup: "公园",
          icon: createIcon({
            url: '/images/park.svg',
            size: [48, 48],
            anchor: [24, 48]
          })
        }
      ]}
    />
  )
}
```

### 地图点击事件处理
```tsx
function MyMap() {
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng
    console.log('点击位置:', lat, lng)
  }

  return (
    <MapImpl
      onMapClick={handleMapClick}
    />
  )
}
```

## 自定义样式

组件使用了 Tailwind CSS 进行样式设置，主要类名包括：

- `.leaflet-container`: 地图容器
- `.leaflet-bottom.leaflet-left`: 缩放级别显示位置
- `.bg-background/80`: 半透明背景
- `.backdrop-blur-sm`: 背景模糊效果

## 注意事项

1. 确保已安装必要的依赖：
   - leaflet
   - react-leaflet
   - @types/leaflet（用于 TypeScript）

2. 地图瓦片服务配置：
   ```typescript
   url={layOutisPoints ? 
     'http://192.168.200.66:3000/tiles/{z}/{x}/{y}/x={x}&y={y}&z={z}.png' : 
     'http://192.168.200.66:3000/w_tiles/{z}/{x}/{y}/x={x}&y={y}&z={z}.png'
   }
   ```
   请根据实际环境配置正确的瓦片服务地址。

3. 图标配置说明：
   - `url`: 图标图片的URL路径（必需）
   - `size`: 图标显示尺寸，默认 [32, 32]
   - `anchor`: 图标锚点位置，默认 [16, 32]（图标底部中心）
   - `popupAnchor`: 弹出框锚点位置，默认 [0, -32]（图标顶部中心）

4. 图标文件格式：
   - 支持 SVG、PNG、JPG 等常见图片格式
   - 建议使用 SVG 格式以获得更好的缩放效果
   - 确保图片文件存放在正确的公共目录中

## 性能优化

1. 使用 `React.useEffect` 处理事件监听器的绑定和解绑
2. 使用 `React.useRef` 避免不必要的重渲染
3. 通过 `selectedMarker` 状态控制弹出框的显示
4. 合理使用 `useMemo` 缓存自定义图标实例

## 更新日志

### 1.2.0
- 增强图标配置功能
- 支持每个标记点使用不同图标
- 添加 createIcon 工具函数
- 优化图标配置接口

### 1.1.0
- 添加标记点标题显示功能
- 支持自定义标记点图标
- 添加地图点击事件回调
- 优化标记点样式

### 1.0.0
- 初始版本发布
- 基本地图功能实现
- 标记点和弹出框支持
- 路径绘制功能 