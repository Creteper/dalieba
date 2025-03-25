/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-25 09:04:24
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-25 10:06:11
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
export default function SearchBox({
  ...prop
}: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div className={cn("md:w-1/2 w-[50px] sm:w-[50px]", prop.className)}>
      {isMobile ? (
        <Button
          variant="outline"
          className=" absolute right-32 top-3"
          onClick={() => setOpen(true)}
        >
          <Search />
          搜索
        </Button>
      ) : (
        <Button
          variant="outline"
          className="justify-start w-full text-muted-foreground hover:scale-100"
          onClick={() => setOpen(true)}
        >
          <Search />
          搜索内容以表决心
          <div className="ml-auto bg-muted p-1 text-[12px] rounded-md">
            Ctrl + Alt + F
          </div>
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
            <CommandItem className="text-orange-500">
              <Flame className="text-orange-500" />
              <span>1. 吃吃吃</span>
            </CommandItem>
            <CommandItem className="text-orange-400">
              <Flame className="text-orange-400" />
              <span>2. 吃吃吃</span>
            </CommandItem>
            <CommandItem className="text-orange-300">
              <Flame className="text-orange-300" />
              <span>3. 吃吃吃</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
