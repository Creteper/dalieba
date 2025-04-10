/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-25 12:12:49
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-25 15:53:40
 * @FilePath: \dalieba\components\home\componentsHome\classBox.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClassBoxProps {
  title: string;
  description: string;
}

export default function ClassBox({ title, description, tag }: ClassBoxProps & { tag: string }) {
  const router = useRouter()

  const handleTabChange = (tab: string) => {
    router.push(`/community?tag=${tab}`);
  }

  return (
    <>
      <div className="flex">
        <div className="flex flex-col">
          <h1 className="font-bold text-xl">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <Button onClick={() => handleTabChange(tag)} className="ml-auto" variant="outline">
          浏览更多
          <ArrowRight />
        </Button>
      </div>
      {/* 内容卡片区域 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="group cursor-pointer w-full">
              <div className="aspect-[16/10] bg-muted rounded-xl overflow-hidden mb-2 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-gradient-to-br from-muted to-accent/5"></div>
              </div>
              <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                推荐内容标题12312311123123131231312x1231231123123123 {i + 1}
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
