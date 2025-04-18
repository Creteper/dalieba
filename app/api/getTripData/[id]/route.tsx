/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-17 13:20:05
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-17 13:20:05
 * @FilePath: \dalieba\app\api\[id]\route.tsx
 * @Description: 路线详情API
 */
import { NextRequest, NextResponse } from "next/server";
import { tripData } from "@/lib/data-static";

// 获取单个路线详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // 尝试查找对应ID的路线
  const trip = tripData.find((trip) => trip.id === parseInt(id));

  // 如果找不到对应路线，返回404错误
  if (!trip) {
    return NextResponse.json({ error: "找不到该路线" }, { status: 404 });
  }

  // 返回找到的路线数据
  return NextResponse.json({ data: trip });
}
