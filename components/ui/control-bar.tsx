/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-18 18:04:57
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-08 15:10:11
 * @FilePath: \dalieba\components\ui\control-bar.tsx
 * @Description: control-bar 封装了主题切换和用户下拉菜单
 */
"use client";

import { ModeToggle } from "../theme/ThemeToggle";
import * as React from "react";
import { cn } from "@/lib/utils";
import DropdownAvatar from "./dropdown-avatar";
import { Button } from "./button";

export default function ControlBar({
  title,
  className,
  variant,
  ...props
}: {
  title?: string;
  variant?: "link" | "default" | "outline" | "ghost" | "reversalDefault";
  className?: string;
} & Omit<React.ComponentProps<"div">, "title" | "className">) {
  // 使用CSS实现动画代替motion库
  return (
    <div
      className={cn(
        "flex items-center gap-4 justify-center fixed top-3 right-3 z-50 animate-slide-down",
        className
      )}
      {...props}
    >
      <div
        className="transition-transform duration-200 w-full flex justify-center items-center gap-4"
        style={{ animationDelay: "400ms" }}
      >
        {title ? (
          <Button disabled={true}>
            <p className="bold">{title}</p>
          </Button>
        ) : null}
        <ModeToggle variant={variant} />
        <DropdownAvatar className="h-9 w-9 rounded-md!" />
      </div>
    </div>
  );
}
