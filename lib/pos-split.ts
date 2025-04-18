export function splitPos(pos: string): Array<{
  latitude: number;
  longitude: number;
}> {
  const posArray = pos.split(";");

  return posArray.map((item) => {
    const [longitude, latitude] = item.split(",");
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
  });
}

/**
 * 从高德地图路径规划API响应中提取所有polyline数据
 * @param response 高德地图API响应
 * @returns 提取的所有polyline数组
 */
export function extractPolylines(response: any): string[] {
  if (!response) {
    return [];
  }

  const polylines: string[] = [];

  try {
    // 使用递归函数查找所有的polyline属性
    extractPolylineRecursive(response, polylines);
  } catch (error) {
    console.error("提取polyline时出错:", error);
  }

  return polylines;
}

/**
 * 递归查找对象中所有的polyline属性
 * @param obj 要搜索的对象
 * @param result 收集结果的数组
 */
function extractPolylineRecursive(obj: any, result: string[]): void {
  if (!obj || typeof obj !== "object") {
    return;
  }

  // 如果是数组，递归处理每个元素
  if (Array.isArray(obj)) {
    obj.forEach((item) => extractPolylineRecursive(item, result));
    return;
  }

  // 遍历对象的所有属性
  for (const key in obj) {
    if (key === "polyline" && typeof obj[key] === "string") {
      // 找到polyline属性，添加到结果数组
      result.push(obj[key]);
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      // 递归处理嵌套对象
      extractPolylineRecursive(obj[key], result);
    }
  }
}

/**
 * 将多个polyline字符串合并为一个，使用分号分隔
 * @param polylines polyline字符串数组
 * @returns 合并后的字符串
 */
export function mergePolylines(polylines: string[]): string {
  // 先展开每个polyline，然后用分号连接
  const allPoints: string[] = [];

  polylines.forEach((polyline) => {
    // 每个polyline都是用分号分隔的点
    const points = polyline.split(";");
    allPoints.push(...points);
  });

  // 去重，因为连续步骤的终点和起点可能是同一个点
  const uniquePoints: string[] = [];
  for (let i = 0; i < allPoints.length; i++) {
    // 跳过重复点
    if (i === 0 || allPoints[i] !== allPoints[i - 1]) {
      uniquePoints.push(allPoints[i]);
    }
  }

  return uniquePoints.join(";");
}

/**
 * 将polyline字符串转换为Leaflet地图可用的坐标点数组
 * @param polyline 包含坐标点的字符串，格式："经度,纬度;经度,纬度;..."
 * @returns [纬度, 经度][] 坐标点数组，注意Leaflet使用[纬度, 经度]格式
 */
export function polylineToCoordinates(polyline: string): [number, number][] {
  if (!polyline) return [];

  const coordinates: [number, number][] = [];
  const points = polyline.split(";");

  points.forEach((point) => {
    if (!point || !point.includes(",")) return;

    const [longitude, latitude] = point.split(",");

    // 验证经纬度有效性
    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (!isNaN(lng) && !isNaN(lat)) {
      // 注意Leaflet使用[纬度, 经度]格式
      coordinates.push([lat, lng]);
    }
  });

  return coordinates;
}

/**
 * 处理高德路径规划API结果，直接返回Leaflet可用的路线坐标数组
 * @param response 高德地图API响应
 * @returns Leaflet坐标点数组 [纬度, 经度][]
 */
export function processRouteToCoordinates(response: any): [number, number][] {
  const polylines = extractPolylines(response);
  const mergedPolyline = mergePolylines(polylines);
  return polylineToCoordinates(mergedPolyline);
}

/**
 * 计算两点之间的距离（使用Haversine公式）
 * @param lat1 纬度1
 * @param lon1 经度1
 * @param lat2 纬度2
 * @param lon2 经度2
 * @returns 两点之间的距离（单位：公里）
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // 地球半径（单位：公里）
  const R = 6371;

  // 将经纬度转换为弧度
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 单位为公里

  return distance;
}

/**
 * 将经纬度转换成 纬度,经度 格式
 * @param lat 纬度
 * @param lon 经度
 * @returns 纬度,经度 格式
 */
export function convertToPos(lat: number, lon: number): [number, number] {
  return [lat, lon];
}
