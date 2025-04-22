/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-20 16:45:06
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-20 16:47:59
 * @FilePath: \dalieba\app\api\getTravel\route.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use server";

import { NextRequest, NextResponse } from "next/server";
import { showFakeData } from "@/lib/data-static";

export async function POST(request: NextRequest) {
  return NextResponse.json({
    code: 200,
    message: "success",
    data: showFakeData,
  });
}
