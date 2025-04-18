/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-16 19:49:53
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-16 19:50:05
 * @FilePath: \dalieba\app\routeRecommend\layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "路线推荐",
  description: "路线推荐",
};

export default function RouteRecommendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}
