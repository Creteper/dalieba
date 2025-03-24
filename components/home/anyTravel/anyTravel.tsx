/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-24 14:10:16
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-24 14:28:03
 * @FilePath: \dalieba\components\home\anyTravel\anyTravel.tsx
 * @Description: 用于显示AnyTravel内容
 */
export default function AnyTravelContent() {
  return (
    <>
      {/* 轮播图区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="aspect-[16/9] h-full bg-muted rounded-xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-muted to-accent/20"></div>
        </div>
        <div className="hidden md:grid grid-cols-2 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="aspect-[16/9] bg-muted rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-full h-full bg-gradient-to-br from-muted to-accent/10"></div>
              </div>
            ))}
        </div>
      </div>

      {/* 内容卡片区域 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[16/10] bg-muted rounded-xl overflow-hidden mb-2 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-gradient-to-br from-muted to-accent/5"></div>
              </div>
              <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                Any Travel 内容标题 {i + 1}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>作者名称</span>
                <span>•</span>
                <span>2.1万浏览</span>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
