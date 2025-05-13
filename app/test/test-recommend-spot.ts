/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-05-05 20:11:02
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-10 09:50:56
 * @FilePath: \dalieba\app\test\test-recommend-spot.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// <reference types="jest" />
// TODO 编写测试获取推荐景点的用例
import { UrlUser } from "@/lib/test_ip";
import ScenicSpot from "@/lib/scenic-spot";
import { RecommendScenicSpotResponse } from "@/types/article";

test("推荐景点", () => {
  expect.assertions(1); // 断言数量 1
  // TODO 实例化 ScenicSpot 类 并且编写断言判断返回成员是否为 4 个
  const sc = new ScenicSpot(UrlUser)
  return sc.recommendScenicSpot<RecommendScenicSpotResponse>()
  .then ((res: RecommendScenicSpotResponse) => {
    expect(res.sights.length).toBe(4)
  })
  .catch((err) => {
    console.log(err)
  }) 
})
