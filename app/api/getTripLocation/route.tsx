"use server";

import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // 从查询字符串获取id
  const id = request.nextUrl.searchParams.get("id");

  return NextResponse.json({
    id: id ? parseInt(id) : null,
  });
}
//   return NextResponse.json({ id });
