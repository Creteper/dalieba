/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-05-05 20:11:02
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-06 23:05:05
 * @FilePath: \dalieba\app\test\recommend-scenic-spot.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

// <reference types="jest" />
import ScenicSpot from "@/lib/scenic-spot";
import { RecommendScenicSpotResponse } from "@/types/article";
import { UrlUser } from "@/lib/test_ip";
test("增加收藏", () => {
  expect.assertions(1);
  const scenicSpot = new ScenicSpot(UrlUser);
  return scenicSpot.recommendScenicSpot<RecommendScenicSpotResponse>().then((res: RecommendScenicSpotResponse) => {
    expect(res.sights.length).toBe(4)
  }).catch((err) => {
    console.log(err)
  })

})
