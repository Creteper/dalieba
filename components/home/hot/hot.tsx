"use client";
import React from "react";

export default function HotContent() {
  return (
    <>
      {/* 轮播图区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="aspect-[16/9] h-full bg-muted rounded-xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-muted to-accent/20"></div>
        </div>
        <div className="hidden md:grid grid-cols-2 gap-4">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="aspect-[16/9] bg-muted rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-full h-full bg-gradient-to-br from-muted to-accent/10"></div>
              </div>
            ))}
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <div
                key={i + 2}
                className="aspect-[16/9] bg-muted rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-full h-full bg-gradient-to-br from-muted to-accent/10"></div>
              </div>
            ))}
        </div>
      </div>
      {/* 内容卡片区域 */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <h1 className="font-bold text-xl">飞遍全国</h1>
          <p className="text-muted-foreground text-sm">绕中国一圈？指日可待！</p>
        </div>
        {/* 内容卡片区域 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="group cursor-pointer w-full">
                <div className="aspect-[16/10] bg-muted rounded-xl overflow-hidden mb-2 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-gradient-to-br from-muted to-accent/5"></div>
                </div>
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  推荐内容标题12312311123123131231312x1231231 {i + 1}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>作者名称</span>
                  <span>•</span>
                  <span>2.1万浏览</span>
                </div>
              </div>
            ))}
        </div>

        <div className="flex flex-col">
          <h1 className="font-bold text-xl">全国美食</h1>
          <p className="text-muted-foreground text-sm">我吃吃吃,吃遍全国</p>
        </div>
        {/* 内容卡片区域 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="group cursor-pointer w-full">
                <div className="aspect-[16/10] bg-muted rounded-xl overflow-hidden mb-2 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-gradient-to-br from-muted to-accent/5"></div>
                </div>
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  推荐内容标题12312311123123131231312x1231231 {i + 1}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>作者名称</span>
                  <span>•</span>
                  <span>2.1万浏览</span>
                </div>
              </div>
            ))}
        </div>

        <div className="flex flex-col">
          <h1 className="font-bold text-xl">Any Travel</h1>
          <p className="text-muted-foreground text-sm">抱网友大腿！</p>
        </div>
        {/* 内容卡片区域 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="group cursor-pointer w-full">
                <div className="aspect-[16/10] bg-muted rounded-xl overflow-hidden mb-2 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-gradient-to-br from-muted to-accent/5"></div>
                </div>
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  推荐内容标题12312311123123131231312x1231231 {i + 1}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>作者名称</span>
                  <span>•</span>
                  <span>2.1万浏览</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
