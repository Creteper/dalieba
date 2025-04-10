"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-5">
        {/* 404数字展示 */}
        <h1 className="text-8xl font-bold text-primary">404</h1>

        {/* 主标题 */}
        <h2 className="text-2xl font-semibold">页面未找到</h2>

        {/* 描述文本 */}
        <p className="text-gray-600 max-w-md mx-auto">
          抱歉，您访问的页面不存在。可能是链接已过期，或者页面已被移除。
        </p>

        {/* 操作按钮 */}
        <div className="flex gap-4 justify-center mt-8">
          <Button onClick={() => router.push("/")}>
            返回首页
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            返回上一页
          </Button>
        </div>
      </div>
    </div>
  );
}
