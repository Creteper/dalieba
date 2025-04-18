"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { MapPin, Search, Home, ArrowLeft, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export default function NotFound() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [rotateAngle, setRotateAngle] = useState(0);

  // 创建旋转动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      setRotateAngle((prev) => (prev + 5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <motion.div
        className="text-center space-y-8 max-w-md p-8 rounded-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 视觉元素 */}
        <div className="relative flex justify-center items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="absolute"
          >
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <motion.div
                animate={{ rotate: rotateAngle }}
                className="text-primary"
              >
                <RefreshCw size={40} />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            className="text-9xl font-bold text-primary relative z-10 mix-blend-multiply"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.5,
              type: "spring",
              bounce: 0.5,
            }}
          >
            404
          </motion.h1>
        </div>

        {/* 主标题 */}
        <motion.h2
          className="text-3xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          迷路了？找不到页面
        </motion.h2>

        {/* 描述文本 */}
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          我们似乎找不到您要查找的页面。可能是地址错误，或者页面已移动到别处。
        </motion.p>

        {/* 虚拟搜索框 */}
        <motion.div
          className="relative max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="flex items-center border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/50">
            <span className="pl-3 text-muted-foreground">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="尝试搜索其他内容..."
              className="px-3 py-2 w-full bg-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.trim()) {
                  router.push(
                    `/allScenicSpotCard?keyword=${encodeURIComponent(
                      searchTerm
                    )}`
                  );
                }
              }}
            />
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Button onClick={() => router.push("/")} size="lg" className="gap-2">
            <Home size={18} />
            返回首页
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            size="lg"
            className="gap-2"
          >
            <ArrowLeft size={18} />
            返回上一页
          </Button>
        </motion.div>

        {/* 额外提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="pt-4 text-xs text-muted-foreground flex items-center justify-center gap-2"
        >
          <MapPin size={12} />
          <span>你也可以探索我们的热门景点或使用搜索功能</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
