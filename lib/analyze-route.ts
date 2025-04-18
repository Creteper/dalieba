/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-17 17:26:06
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-17 20:13:23
 * @FilePath: \dalieba\lib\analyze-route.ts
 * @Description: 分析路线数据
 */
import { RouteData, PathBoxResponse } from "@/types/article";
import { MapMaker, Route } from "@/components/map/MapComponent";
import ScenicSpot from "./scenic-spot";
import {
  TripData,
  SpotData,
  beforeSpotData,
  nextSpotData,
} from "@/types/article";
import { convertToPos } from "./pos-split";

export default class AnalyzeRoute {
  private routeData: RouteData;

  constructor(routeData: RouteData) {
    this.routeData = routeData;
  }

  /**
   * 获取路线数据
   * @returns 路线数据
   */
  getRouteData(): RouteData {
    return this.routeData;
  }

  /**
   * 获取每天数据 返回数组
   * @returns 每天数据
   */
  getDaysData(): SpotData[] {
    return this.routeData.spots;
  }

  /**
   * 获取每天详细数据
   * @param day 第几天
   * @returns 每天详细数据
   */
  getDayDetailData(day: number): SpotData {
    return this.routeData.spots[day - 1];
  }

  /**
   * 获取每天景点数据
   * @param day 第几天
   * @param id 景点id
   * @returns 景点数据
   */
  getDaySpotData(day: number, id: number): TripData {
    return this.routeData.spots[day - 1].trip.find(
      (spot) => spot.id === id
    ) as TripData;
  }

  /**
   * 获取type 为 Start的 景点数据
   * @returns 景点数据
   */
  getStartSpotData(): TripData {
    return this.routeData.spots[0].trip.find(
      (spot) => spot.type === "start"
    ) as TripData;
  }

  /**
   * 获取type 为 spot的 当天数据
   * @param day 第几天
   * @param id 景点id
   * @returns 景点数据
   */
  getSpotData(day: number, id: number): TripData {
    return this.routeData.spots[day - 1].trip.find(
      (spot) => spot.type === "spot" && spot.id === id
    ) as TripData;
  }

  /**
   * 获取type 为 end的 全部数据
   * @returns 景点数据
   */
  getEndData(): TripData {
    return this.routeData.spots[this.routeData.spots.length - 1].trip.find(
      (spot) => spot.type === "end"
    ) as TripData;
  }

  /**
   * 获取type 为 end的 酒店数据
   * @returns 酒店数据
   */
  getHotelData(): TripData {
    return this.routeData.spots[this.routeData.spots.length - 1].trip.find(
      (spot) => spot.type === "end" && spot.hotelType !== "none"
    ) as TripData;
  }

  /**
   * 获取type 为 beforeSpot的 景点数据
   * @param day 第几天
   * @param id 景点id
   * @returns 景点数据
   */
  getBeforeSpotData(day: number, id: number): beforeSpotData | undefined {
    const spot = this.routeData.spots[day - 1].trip.find(
      (spot) => spot.id === id
    );
    return spot?.beforeSpot;
  }

  /**
   * 获取type 为 nextSpot的 景点数据
   * @param day 第几天
   * @param id 景点id
   * @returns 景点数据
   */
  getNextSpotData(day: number, id: number): nextSpotData | undefined {
    const spot = this.routeData.spots[day - 1].trip.find(
      (spot) => spot.id === id
    );
    return spot?.nextSpot;
  }

  /**
   * 获取所有景点经纬度
   * @returns 景点经纬度
   */
  getAllLocation(): [number, number][] {
    return this.routeData.spots.flatMap((day) =>
      day.trip.map((spot) => spot.location)
    );
  }

  /**
   * 获取所有makers信息
   * @returns makers信息
   */
  getAllMakers(): MapMaker[] {
    return this.routeData.spots.flatMap((day) =>
      day.trip.map((spot) => ({
        position: convertToPos(spot.location[1], spot.location[0]),
        popup: spot.name,
        description: spot.description,
        title: spot.name,
        icon: {
          url: "/images/location.svg",
          size: [32, 32],
          anchor: [16, 16],
        },
      }))
    );
  }

  /**
   * 按照天返回makers信息
   * @param day 第几天
   * @returns makers信息
   */
  getDayMakers(day: number): MapMaker[] {
    return this.routeData.spots[day - 1].trip.map((spot) => ({
      position: convertToPos(spot.location[1], spot.location[0]),
      popup: spot.name,
      description: spot.description,
      title: spot.name,
      icon: {
        url: "/images/location.svg",
        size: [32, 32],
        anchor: [16, 16],
      },
    }));
  }

  /**
   * 获取每天路线数据
   * @param day 第几天
   * @returns 路线数据
   */
  async getDayRoutes(day: number): Promise<Route[]> {
    try {
      const dayData = this.routeData.spots[day - 1];
      const routes: Route[] = [];
      const scenicSpot = new ScenicSpot();

      // 遍历所有景点，连接相邻点
      for (let i = 0; i < dayData.trip.length - 1; i++) {
        const currentSpot = dayData.trip[i];
        const nextSpot = dayData.trip[i + 1];

        // 使用地点名称而非坐标
        const originName = currentSpot.name;
        const destinationName = nextSpot.name;

        try {
          console.log(`请求路径: ${originName} -> ${destinationName}`);

          // 调用API获取路径规划数据
          const pathBoxResponse =
            await scenicSpot.getScenicSpotPathBox<PathBoxResponse>(
              originName,
              destinationName
            );

          if (
            pathBoxResponse &&
            pathBoxResponse.route_ponit &&
            pathBoxResponse.route_ponit.length > 0
          ) {
            // 处理返回的路径点
            const allPositions: [number, number][] = [];

            // 遍历所有路径段
            pathBoxResponse.route_ponit.forEach((route) => {
              if (route.location_box) {
                // 处理location_box格式："126.617717,45.77487;126.617695,45.774905;..."
                const points = route.location_box.split(";");

                points.forEach((point) => {
                  const [lon, lat] = point.split(",").map(Number);
                  // 确保坐标有效
                  if (!isNaN(lon) && !isNaN(lat)) {
                    // 使用convertToPos转换格式
                    allPositions.push(convertToPos(lat, lon));
                  }
                });
              }
            });

            if (allPositions.length > 0) {
              // 创建路线
              routes.push({
                positions: allPositions,
                color: "#3b82f6", // 蓝色
                weight: 3,
                opacity: 0.8,
              });
            }
          }
        } catch (error) {
          // 如果API调用失败，使用直线连接
          const startPos = convertToPos(
            currentSpot.location[1],
            currentSpot.location[0]
          );
          const endPos = convertToPos(
            nextSpot.location[1],
            nextSpot.location[0]
          );

          routes.push({
            positions: [startPos, endPos],
            color: "#ef4444", // 红色表示备用路线
            weight: 2,
            opacity: 0.6,
            dashArray: "5,5", // 虚线
          });
        }
      }

      return routes;
    } catch (error) {
      console.error("获取路线数据失败:", error);
      return [];
    }
  }
}
