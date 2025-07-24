import { Button } from "@/components/ui/button";
import { MapPin as MapPinIcon, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  currentCategory: 'spot' | 'hotel';
  onCategoryChange: (category: 'spot' | 'hotel') => void;
  isMobile?: boolean;
  className?: string;
}

export default function CategoryTabs({
  currentCategory,
  onCategoryChange,
  isMobile = false,
  className
}: CategoryTabsProps) {
  return (
    <div className={cn(
      "bg-background/50 rounded-lg p-1",
      isMobile ? "flex gap-2 bg-muted/30 rounded-xl p-2" : "flex gap-1",
      className
    )}>
      <Button
        variant={currentCategory === 'spot' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          "flex-1",
          isMobile ? "h-10" : "h-8 text-xs"
        )}
        onClick={() => onCategoryChange('spot')}
      >
        <MapPinIcon className={cn(
          "mr-1",
          isMobile ? "h-4 w-4 mr-2" : "h-3 w-3"
        )} />
        景点
      </Button>
      <Button
        variant={currentCategory === 'hotel' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          "flex-1",
          isMobile ? "h-10" : "h-8 text-xs"
        )}
        onClick={() => onCategoryChange('hotel')}
      >
        <Building className={cn(
          "mr-1",
          isMobile ? "h-4 w-4 mr-2" : "h-3 w-3"
        )} />
        酒店
      </Button>
    </div>
  );
} 