"use client";
import React from "react";
import ClassBox from "../componentsHome/classBox";
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
        <ClassBox title="全国旅行" description="飞遍全中国！指日可待" />
        <ClassBox title="全国美食" description="我吃吃吃,吃遍全国" />
        <ClassBox title="Any Travel" description="抱网友大腿！" />
      </div>
    </>
  );
}
