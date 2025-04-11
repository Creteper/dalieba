/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-25 09:04:24
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-10 09:54:30
 * @FilePath: \dalieba\components\home\search\search.tsx
 * @Description: 用于显示搜索框
 */

"use client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Flame } from "lucide-react";
import * as React from "react";
import ScenicSpot from "@/lib/scenic-spot";
import { RecommendScenicSpotResponse } from "@/types/article";
export default function SearchBox({
  ...prop
}: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const [recommendScenicSpot, setRecommendScenicSpot] = useState<RecommendScenicSpotResponse>({ sights: [] });
  const scenicSpot = new ScenicSpot();

  React.useEffect(() => {
    async function getRecommendScenicSpot() {
      const res = await scenicSpot.recommendScenicSpot<RecommendScenicSpotResponse>();
      setRecommendScenicSpot(res);
    }
    getRecommendScenicSpot();
  },[])
  return (
    <div className={cn("md:w-1/2 w-[150px] sm:w-[150px]", prop.className)}>
      {isMobile ? (
        <Button
          variant="outline"
          className="justify-start w-full text-muted-foreground hover:scale-100"
          onClick={() => setOpen(true)}
        >
          <Search />
          搜索内容
        </Button>
      ) : (
        <Button
          variant="outline"
          className="justify-start w-full text-muted-foreground hover:scale-100"
          onClick={() => setOpen(true)}
        >
          <Search />
          搜索内容以表决心
        </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="搜索以继续..." />
        <CommandList>
          <CommandEmpty>无推荐内容</CommandEmpty>
          <CommandGroup heading="热门推荐">
            <CommandItem>
              <span>AI生成旅行攻略...</span>
            </CommandItem>
            <CommandItem>
              <span>最美哈尔滨</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="热门榜单">
            <CommandItem className="text-orange-500! hover:text-orange-500!">
              <Flame className="text-orange-500!" />
              <span className="text-orange-500!">1. {recommendScenicSpot?.sights?.[0]?.name}</span>
            </CommandItem>
            <CommandItem className="text-orange-400! hover:text-orange-400!">
              <Flame className="text-orange-400" />
              <span className="text-orange-400!">2. {recommendScenicSpot?.sights?.[1]?.name}</span>
            </CommandItem>
            <CommandItem className="text-orange-300! hover:text-orange-300!">
              <Flame className="text-orange-300" />
              <span className="text-orange-300!">3. {recommendScenicSpot?.sights?.[2]?.name}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
