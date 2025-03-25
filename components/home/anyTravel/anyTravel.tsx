/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-24 14:10:16
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-24 14:28:03
 * @FilePath: \dalieba\components\home\anyTravel\anyTravel.tsx
 * @Description: 用于显示AnyTravel内容
 */

'use client';

import ClassBox from "../componentsHome/classBox";

export default function AnyTravelContent() {
    return (
        <>
            {/* 轮播图区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="aspect-[16/9] h-full bg-muted rounded-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-muted to-accent/20"></div>
                </div>
                <div className="hidden md:grid grid-cols-2 gap-4">
                    {Array(4)
                        .fill(0)
                        .map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[16/9] bg-muted rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                            >
                                <div className="w-full h-full bg-gradient-to-br from-muted to-accent/10"></div>
                            </div>
                        ))}
                </div>
            </div>
            {/* 内容卡片区域 */}
            <div className="flex flex-col gap-8">
                <ClassBox tag="goTravel" title="全国旅行" description="飞遍全中国！指日可待" />
                <ClassBox tag="goEat" title="全国美食" description="我吃吃吃,吃遍全国" />
                <ClassBox tag="AnyTravel" title="Any Travel" description="抱网友大腿！" />
            </div>
        </>
    );
}
