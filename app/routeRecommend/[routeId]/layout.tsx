import { Metadata } from "next";
import { tripData } from "@/lib/data-static";

async function getRouteData(routeId: string) {
  // 使用异步函数模拟获取路由数据
  const route = tripData.find((route) => route.id === parseInt(routeId));
  return route;
}

// 动态生成metadata
export async function generateMetadata({
  params,
}: {
  params: { routeId: string };
}): Promise<Metadata> {
  try {
    // 使用异步函数获取路由数据
    const route = await getRouteData(params.routeId);

    return {
      title: `路线推荐 - ${route?.title || "详情"}`,
      description: `${route?.highlights || "路线推荐"}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "路线推荐",
      description: "路线详情页面",
    };
  }
}

export default function RouteRecommendLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { routeId: string };
}) {
  return <div className="w-full h-full">{children}</div>;
}
