import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

interface ScenicSpotPanelProps {
  selectedMarker: SelectedMarker;
  points: PointResponse[];
  starredSpots: number[];
  currentCategory: 'spot' | 'hotel';
  isOnGuide: boolean;
  onStarToggle: (id: number) => void;
  onGuideClick: (scenicSpot: string, userId: string) => void;
  isMobile?: boolean;
  className?: string;
}

export default function ScenicSpotPanel({
  selectedMarker,
  points,
  starredSpots,
  currentCategory,
  isOnGuide,
  onStarToggle,
  onGuideClick,
  isMobile = false,
  className
}: ScenicSpotPanelProps) {
  const router = useRouter();

  const currentPoint = points.find(
    (p) =>
      p.location[0] === selectedMarker.position[0] &&
      p.location[1] === selectedMarker.position[1]
  );

  const isStarred = currentPoint ? starredSpots.includes(currentPoint.id) : false;

  const handleDetailClick = () => {
    if (currentPoint) {
      const routePath = currentCategory === 'hotel' 
        ? `/scenicSpot/${currentPoint.id}/hotel`
        : `/scenicSpot/${currentPoint.id}/spot`;
      router.push(routePath);
    }
  };

  const handleStarClick = () => {
    if (currentPoint) {
      onStarToggle(currentPoint.id);
    }
  };

  const handleGuideClick = () => {
    const userId = localStorage.getItem("user_id") || "";
    onGuideClick(selectedMarker.popup || "", userId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 20 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className={cn(
        "bg-background/90 backdrop-blur-md rounded-xl shadow-xl border border-border/50 p-5 overflow-hidden",
        isMobile ? "space-y-4" : "mt-3",
        className
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className={cn(
          "font-semibold truncate pr-2 text-foreground",
          isMobile ? "text-xl pr-3" : "text-base md:text-lg"
        )}>
          {selectedMarker.popup}
        </h3>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-0 flex-shrink-0 rounded-full",
              isMobile ? "h-10 w-10" : "h-8 w-8",
              isStarred
                ? "text-yellow-500 bg-yellow-500/10"
                : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"
            )}
            onClick={handleStarClick}
          >
            {isStarred ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            )}
          </Button>
        </motion.div>
      </div>

      <div className={cn(
        "bg-muted/30 rounded-lg border border-border/20",
        isMobile ? "rounded-xl p-4" : "p-3"
      )}>
        <p className={cn(
          "text-muted-foreground overflow-hidden text-ellipsis",
          isMobile ? "text-sm leading-relaxed" : "text-xs md:text-sm line-clamp-2"
        )}>
          {selectedMarker.description}
        </p>
      </div>

      <div className={cn(
        "flex flex-col gap-3",
        isMobile ? "grid grid-cols-1 gap-3" : "mt-4"
      )}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            className={cn(
              "w-full relative overflow-hidden group",
              isMobile ? "h-12" : ""
            )}
            disabled={isOnGuide}
            variant={"tw"}
            onClick={handleGuideClick}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg blur-sm"></div>
            <div className="relative flex items-center justify-center">
              {isOnGuide ? (
                <>
                  <div className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  <span>导游中...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                  <span>AI 导游</span>
                </>
              )}
            </div>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            className={cn(
              "w-full relative overflow-hidden group",
              isMobile ? "h-12" : ""
            )}
            variant={"tw"}
            onClick={handleDetailClick}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg blur-sm"></div>
            <div className="relative flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>查看详情</span>
            </div>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
} 