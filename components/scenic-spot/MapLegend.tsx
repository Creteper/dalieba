import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface MapLegendProps {
  currentCategory: 'spot' | 'hotel';
  isMobile?: boolean;
  className?: string;
}

export default function MapLegend({
  currentCategory,
  isMobile = false,
  className
}: MapLegendProps) {
  const categoryText = currentCategory === 'hotel' ? '酒店' : '景点';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn(
        "flex flex-col gap-4 bg-background/90 backdrop-blur-md border border-border/30 shadow-lg p-4 rounded-xl",
        className
      )}
    >
      <h3 className="text-sm font-medium mb-1 text-foreground/90">
        地图图例
      </h3>
      
      <div className="flex items-center text-sm gap-2">
        <div className="p-1 bg-primary/10 rounded-full">
          <img src="/images/location-custom.svg" className="w-4 h-4" alt="" />
        </div>
        <span className="text-foreground/80">焦点{categoryText}</span>
      </div>
      
      <div className="flex items-center text-sm gap-2">
        <div className="p-1 bg-green-500/10 rounded-full">
          <img
            src="/images/location-custom-green.svg"
            className="w-4 h-4"
            alt=""
          />
        </div>
        <span className="text-foreground/80">已收藏{categoryText}</span>
      </div>
      
      <div className="flex items-center text-sm gap-2">
        <div className="p-1 bg-muted/50 rounded-full">
          <img src="/images/location.svg" className="w-4 h-4" alt="" />
        </div>
        <span className="text-foreground/80">{categoryText}位置</span>
      </div>
    </motion.div>
  );
} 