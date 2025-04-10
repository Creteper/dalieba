"use client";

import { cn } from "@/lib/utils";

interface SpotCardProps {
  name: string;
  rating: string;
  description: string;
  imageUrl: string;
  className?: string;
}

export default function SpotCard({ 
  name, 
  rating, 
  description, 
  imageUrl, 
  className 
}: SpotCardProps) {
  return (
    <div className={cn(
      "flex-shrink-0 w-[220px] md:w-auto bg-background rounded-lg shadow-md overflow-hidden snap-start", 
      className
    )}>
      <div className="h-40 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{name}</h3>
          <span className="text-orange-500 font-bold text-sm">
            {rating}分
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </div>
    </div>
  );
} 