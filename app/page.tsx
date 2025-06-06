/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-18 13:32:25
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-11 14:51:27
 * @FilePath: \dalieba\app\page.tsx
 * @Description: 用于显示首页内容
 */
'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Main() {
    const router = useRouter();
    
    useEffect(() => {
        router.push("/home");
    }, [router]);


    return (
        <div
            className="w-full h-screen flex items-center justify-center"
        >
            <div className="text-center">
                <div className="w-16 h-16 border-t-4 border-foreground border-solid rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-foreground">页面加载中...</p>
            </div>
        </div>
    )
}