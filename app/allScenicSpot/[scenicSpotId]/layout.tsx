/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-16 19:29:08
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-16 19:29:30
 * @FilePath: \dalieba\app\allScenicSpot\[scenicSpotId]\layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "全部景点",
  description: "全部景点",
};

export default function AllScenicSpotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
