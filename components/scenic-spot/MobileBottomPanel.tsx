import { Button } from "@/components/ui/button";
import { motion, PanInfo } from "motion/react";
import { Home, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import CategoryTabs from "./CategoryTabs";
import LanguageSelector from "./LanguageSelector";
import SearchBox from "./SearchBox";
import ScenicSpotPanel from "./ScenicSpotPanel";

interface PointResponse {
  id: number;
  name: string;
  location: [number, number];
  description: string;
}

interface SelectedMarker {
  position: [number, number];
  popup?: string;
  description?: string;
  title?: string;
}

interface MobileBottomPanelProps {
  panelHeight: number;
  isDragging: boolean;
  currentCategory: 'spot' | 'hotel';
  selectedLanguage: string;
  searchQuery: string;
  filteredPoints: PointResponse[];
  selectedIndex: number;
  selectedMarker: SelectedMarker | null;
  points: PointResponse[];
  starredSpots: number[];
  isOnGuide: boolean;
  onDrag: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onCategoryChange: (category: 'spot' | 'hotel') => void;
  onLanguageChange: (language: string) => void;
  onSearchChange: (query: string) => void;
  onPointSelect: (point: PointResponse) => void;
  onStarToggle: (id: number) => void;
  onGuideClick: (scenicSpot: string, userId: string) => void;
  onDragStart: () => void;
}

export default function MobileBottomPanel({
  panelHeight,
  isDragging,
  currentCategory,
  selectedLanguage,
  searchQuery,
  filteredPoints,
  selectedIndex,
  selectedMarker,
  points,
  starredSpots,
  isOnGuide,
  onDrag,
  onDragEnd,
  onCategoryChange,
  onLanguageChange,
  onSearchChange,
  onPointSelect,
  onStarToggle,
  onGuideClick,
  onDragStart
}: MobileBottomPanelProps) {
  const router = useRouter();

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/30 shadow-2xl"
      style={{ height: panelHeight }}
      animate={{ height: panelHeight }}
      transition={{ duration: isDragging ? 0 : 0.3, ease: "easeOut" }}
    >
      {/* 拖拽手柄 */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        whileTap={{ scale: 1.02 }}
      >
        <div className="w-12 h-1 bg-muted-foreground/30 rounded-full"></div>
      </motion.div>

      {/* 面板内容 */}
      <div className="p-4 pt-8 h-full overflow-hidden flex flex-col">
        {/* 返回按钮 */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/")}
            className="w-full px-4 py-3 rounded-xl dark:bg-gradient-to-r dark:from-background/90 dark:to-background/80 bg-gradient-to-r from-primary/90 to-primary/80 text-white flex items-center justify-center gap-2 shadow-lg border border-primary/20"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm font-medium">返回首页</span>
          </motion.button>
        </motion.div>

        {/* 类别切换 */}
        <div className="mb-4">
          <CategoryTabs
            currentCategory={currentCategory}
            onCategoryChange={onCategoryChange}
            isMobile={true}
          />
        </div>

        {/* 语言切换 */}
        <div className="mb-4">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            isMobile={true}
          />
        </div>

        {/* 搜索框 */}
        <div className="mb-4">
          <SearchBox
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            filteredPoints={filteredPoints}
            selectedIndex={selectedIndex}
            onPointSelect={onPointSelect}
            currentCategory={currentCategory}
            isMobile={true}
            className=""
          />
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden">
          {searchQuery ? (
            // 搜索结果在SearchBox组件中处理
            <SearchBox
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              filteredPoints={filteredPoints}
              selectedIndex={selectedIndex}
              onPointSelect={onPointSelect}
              currentCategory={currentCategory}
              isMobile={true}
              className="h-full"
            />
          ) : selectedMarker ? (
            // 景点详情
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
              <ScenicSpotPanel
                selectedMarker={selectedMarker}
                points={points}
                starredSpots={starredSpots}
                currentCategory={currentCategory}
                isOnGuide={isOnGuide}
                onStarToggle={onStarToggle}
                onGuideClick={onGuideClick}
                isMobile={true}
                className=""
              />
            </div>
          ) : (
            // 默认状态
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full text-center py-8"
            >
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                探索{currentCategory === 'hotel' ? '酒店' : '景点'}
              </h3>
              <p className="text-sm text-muted-foreground/80 max-w-[200px]">
                点击地图上的{currentCategory === 'hotel' ? '酒店' : '景点'}标记或使用搜索功能来发现精彩的地方
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 