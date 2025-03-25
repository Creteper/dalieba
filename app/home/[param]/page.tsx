/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-24 14:16:24
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-24 15:33:32
 * @FilePath: \dalieba\app\home\[param]\page.tsx
 * @Description: 用于处理home下的动态路由
 */
'use client'

interface PageParams {
  params: {
    param: string
  }
}

export default function HomeActivePage({ params }: PageParams) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        {decodeURIComponent(params.param)}
      </h1>
      <div className="prose max-w-none">
        {/* 这里可以根据param参数加载对应的内容 */}
      </div>
    </div>
  )
}