/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-03-24 08:38:55
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-02 15:45:42
 * @FilePath: \dalieba\app\personal\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UserClient from "@/lib/use-client";

export default function PersonalPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/personal/setting");

    }, [router]);
}