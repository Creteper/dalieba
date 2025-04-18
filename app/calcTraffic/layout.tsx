/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-16 18:23:17
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-16 19:42:00
 * @FilePath: \dalieba\app\calcTraffic\layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "计算出行时间",
  description: "计算出行时间",
};

export default function CalcTrafficLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}
