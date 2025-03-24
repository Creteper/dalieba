/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-24 12:48:55
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-24 14:23:59
 * @FilePath: \dalieba\app\home\layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Metadata } from "next";
import HomePage from "./page";
export const metadata: Metadata = {
  title: "Go! Together 出去玩？ 走！",
  description: "Go ! Together 首页"
}

export default function HomeLayOut() {
  return (
    <HomePage />
  )
}