/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-07-24
 * @FilePath: /components/ui/mobile-bottom-nav.tsx
 * @Description: 移动端底部导航栏，仅在首页显示
 */

"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, BookOpen, MapPin, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // 非移动端直接不渲染
  if (!isMobile) return null;

  const navItems: NavItem[] = [
    { label: "首页", path: "/home", icon: <Home className="size-5" /> },
    { label: "规划", path: "/createplan", icon: <BookOpen className="size-5" /> },
    {
      label: "景点",
      path: "/allScenicSpot/all",
      icon: <MapPin className="size-5" />,
    },
    { label: "我的", path: "/personal", icon: <UserRound className="size-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border/40 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <nav className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              className="w-full py-2 flex flex-col items-center justify-center gap-0.5 text-xs"
              onClick={() => router.push(item.path)}
            >
              <span
                className={cn("text-muted-foreground", {
                  "text-primary": isActive,
                })}
              >
                {item.icon}
              </span>
              <span
                className={cn("mt-0.5", {
                  "text-primary": isActive,
                  "text-muted-foreground": !isActive,
                })}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
} 