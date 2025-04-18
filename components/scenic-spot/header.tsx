"use client";

import { motion } from "motion/react";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServerConfig } from "@/lib/site";
import { useRouter } from "next/navigation";

export default function ScenicSpotHeader({ spotDetail }: { spotDetail: any }) {
  const router = useRouter();

  return (
    <motion.div
      className="relative h-[50vh] md:h-[60vh] w-full"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('${ServerConfig.userApiUrl}/img/${spotDetail.name}.jpg')`,
        }}
      />
      {/* 添加渐变效果 */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-black/30 backdrop-blur-sm">
        {/* 悬浮导航按钮 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="container mx-auto px-4 pt-16 h-full flex flex-col"
        >
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full bg-background/30 backdrop-blur-md hover:bg-background/50 text-white self-start transition-all duration-300 hover:scale-105 hover:shadow-glow"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <motion.div
            className="mt-auto mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* 景点名称动画效果 */}
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              {spotDetail.name}
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap items-center mt-3 gap-3"
            >
              <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Star className="fill-yellow-400 stroke-yellow-400 h-4 w-4 mr-1" />
                <span className="text-white text-sm font-medium">4.8</span>
              </div>

              <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                <MapPin className="h-4 w-4 mr-1 text-white/90" />
                <span className="text-white/90 text-sm truncate max-w-[200px] md:max-w-md">
                  {spotDetail.address}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
