import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface PointResponse {
  id: number;
  name: string;
  location: [number, number];
  description: string;
}

interface SearchBoxProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredPoints: PointResponse[];
  selectedIndex: number;
  onPointSelect: (point: PointResponse) => void;
  currentCategory: 'spot' | 'hotel';
  isMobile?: boolean;
  className?: string;
}

export default function SearchBox({
  searchQuery,
  onSearchChange,
  filteredPoints,
  selectedIndex,
  onPointSelect,
  currentCategory,
  isMobile = false,
  className
}: SearchBoxProps) {
  return (
    <div className={cn("", className)}>
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
        <Input
          placeholder={`搜索${currentCategory === 'hotel' ? '酒店' : '景点'}...`}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "pl-9 text-sm bg-background/70 focus-visible:ring-primary/40",
            isMobile ? "h-12 border border-border/30 rounded-xl" : "h-10 border-0 rounded-lg"
          )}
        />
      </div>

      {/* 搜索结果 */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className={cn(
            "overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
            isMobile ? "h-full" : "max-h-[250px]"
          )}
        >
          {filteredPoints.length === 0 ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex flex-col items-center justify-center",
                isMobile ? "py-12" : "py-6"
              )}
            >
              <div className={cn(
                "rounded-full bg-muted/50 mb-3",
                isMobile ? "p-4 mb-4" : "p-3"
              )}>
                <Search className={cn(
                  "text-muted-foreground/60",
                  isMobile ? "h-6 w-6" : "h-5 w-5"
                )} />
              </div>
              <p className={cn(
                "font-medium text-muted-foreground",
                isMobile ? "text-base mb-2" : "text-sm"
              )}>
                未找到相关{currentCategory === 'hotel' ? '酒店' : '景点'}
              </p>
              <p className={cn(
                "text-muted-foreground/70",
                isMobile ? "text-sm" : "text-xs mt-1.5"
              )}>
                请尝试其他关键词
              </p>
            </motion.div>
          ) : (
            <div className={cn("space-y-1", isMobile ? "space-y-2" : "px-2 py-1")}>
              <div className={cn(
                "font-medium text-muted-foreground/90",
                isMobile ? "px-2 py-2 text-sm" : "px-2 py-1.5 text-xs"
              )}>
                搜索结果 ({filteredPoints.length})
              </div>
              <div>
                {filteredPoints.map((point, index) => (
                  <motion.div
                    key={point.id}
                    initial={{ opacity: 0, y: isMobile ? 10 : 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * (isMobile ? 0.05 : 0.03) }}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left transition-all duration-200",
                        isMobile ? "px-3 py-4 h-auto rounded-xl" : "px-2 py-2 h-auto rounded-lg",
                        index === selectedIndex
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted/70 text-foreground"
                      )}
                      onClick={() => onPointSelect(point)}
                    >
                      <div className="flex items-start w-full overflow-hidden">
                        <div className={cn(
                          "flex-shrink-0",
                          isMobile ? "mr-3 mt-1" : "mr-2 mt-0.5"
                        )}>
                          <MapPin className={cn(
                            "text-primary",
                            isMobile ? "h-4 w-4" : "h-3.5 w-3.5"
                          )} />
                        </div>
                        <div className="flex flex-col items-start w-full min-w-0">
                          <span className={cn(
                            "font-medium truncate w-full",
                            isMobile ? "text-base" : "text-sm"
                          )}>
                            {point.name}
                          </span>
                          <span className={cn(
                            "text-muted-foreground/80 truncate w-full",
                            isMobile ? "text-sm mt-1" : "text-xs mt-0.5"
                          )}>
                            {point.description}
                          </span>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {!isMobile && (
            <div className="flex items-center justify-between text-[10px] text-muted-foreground px-3 py-2 border-t border-border/20 mt-1 bg-muted/10">
              <div className="flex items-center space-x-1">
                <span>提示:</span>
                <div className="inline-flex items-center border border-border/30 px-1 rounded text-[9px]">
                  ↑↓
                </div>
                <span>选择</span>
                <span>·</span>
                <div className="inline-flex items-center border border-border/30 px-1 rounded text-[9px]">
                  Enter
                </div>
                <span>确认</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
} 