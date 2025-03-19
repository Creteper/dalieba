This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 地图组件使用指南

本项目集成了基于 Leaflet 的地图组件，可用于展示自定义地图瓦片和标记点。

### 安装依赖

地图组件依赖于以下包：
```bash
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

### 组件使用方法

1. 基本使用：
```tsx
import MapComponent from '@/components/map/MapComponent'

<MapComponent 
  className="h-[500px]" 
  center={[45.75, 126.63]} // 纬度, 经度（默认为哈尔滨坐标）
  zoom={13}                // 缩放级别（默认为13）
/>
```

2. 添加标记点：
```tsx
<MapComponent 
  className="h-[70vh]" 
  markers={[
    {
      position: [45.7733, 126.6425],  // 纬度, 经度
      popup: "索菲亚大教堂"           // 弹出信息（可选）
    },
    {
      position: [45.7563, 126.6353],
      popup: "中央大街"
    }
  ]}
/>
```

3. 自定义瓦片服务器：

地图组件默认使用以下瓦片服务URL：
```
http://localhost:3002/tiles/{z}/{x}/{y}/x={x}&y={y}&z={z}.png
```

确保您的瓦片服务已正确配置并在指定端口运行。

### 技术说明

- 地图组件使用客户端渲染，确保与Next.js的SSR/SSG兼容
- 支持响应式设计，可通过className调整尺寸
- 支持深色模式适配
- 自定义标记图标使用CDN资源，确保在各种环境下正常显示

### 示例页面

访问 `/map` 路径可以查看地图组件的完整示例实现。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## About

大列巴项目正式启动，选择使用next js 框架和 tailwind css + shadcn ui 来制作