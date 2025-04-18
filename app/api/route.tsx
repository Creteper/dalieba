/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-17 12:46:53
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-17 12:53:12
 * @FilePath: \dalieba\app\api\route.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use server";

import { NextRequest, NextResponse } from "next/server";
import { tripData } from "@/lib/data-static";

// 获取所有路线数据
export async function GET() {
  return NextResponse.json({ data: tripData });
}
