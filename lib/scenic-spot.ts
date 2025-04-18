import { Http } from "@/lib/axios";
import { ServerConfig } from "./site";
import { StarredScenicSpotResponse } from "@/types/article";
export default class ScenicSpot {
  private http = new Http(ServerConfig.userApiUrl || "");

  public async recommendScenicSpot<T>(): Promise<T> {
    const res = await this.http.get("/recommend_sights");
    return res.data as T;
  }

  public async getAllScenicSpot<T>(token: string | null = null): Promise<T> {
    if (token) {
      this.http.setAuthToken(token);
    } else {
      if (typeof window !== "undefined") {
        this.http.setAuthToken(localStorage.getItem("token") || "");
      }
    }
    const res = await this.http.get("/all_sights");
    return res.data as T;
  }

  public async keywordSearch<T>(keyword: string): Promise<T> {
    try {
      const res = await this.http.get(`/keyword_search/${keyword}`);
      console.log("关键词搜索API返回:", res);

      // 如果res.data为空，返回一个空的sights数组作为默认值
      if (!res.data) {
        return { sights: [] } as unknown as T;
      }

      return res.data as T;
    } catch (error) {
      console.error("关键词搜索API错误:", error);
      // 出错时也返回一个空的sights数组
      return { sights: [] } as unknown as T;
    }
  }

  public async getStarredScenicSpot<T>(
    token: string | null = null
  ): Promise<T> {
    if (token) {
      this.http.setAuthToken(token);
    } else {
      if (typeof window !== "undefined") {
        this.http.setAuthToken(localStorage.getItem("token") || "");
      }
    }
    const res = await this.http.get("/select_user_book_mark");
    return res.data as T;
  }

  public async addStarredScenicSpot<T>(
    sight: StarredScenicSpotResponse,
    token: string | null = null
  ): Promise<T> {
    if (token) {
      this.http.setAuthToken(token);
    } else {
      if (typeof window !== "undefined") {
        this.http.setAuthToken(localStorage.getItem("token") || "");
      }
    }
    const res = await this.http.post("/add_book_mark", {
      id: sight.id,
      pname: sight.pname,
      city_name: sight.city_name,
      adname: sight.adname,
      name: sight.name,
      address: sight.address,
      localtion: sight.localtion,
    });
    console.log("添加收藏响应:", res.data);
    return res.data as T;
  }

  public async deleteStarredScenicSpot<T>(
    sight: StarredScenicSpotResponse,
    token: string | null = null
  ): Promise<T> {
    if (token) {
      this.http.setAuthToken(token);
    } else {
      if (typeof window !== "undefined") {
        this.http.setAuthToken(localStorage.getItem("token") || "");
      }
    }
    const res = await this.http.post("/del_book_mark", {
      user_id: Number(localStorage.getItem("user_id")),
      gd_id: sight.id,
      name: sight.name,
      address: sight.address,
      location: sight.localtion,
    });
    console.log("删除收藏响应:", res.data);
    return res.data as T;
  }

  public async getScenicSpotPathBox<T>(
    origin: string,
    destination: string
  ): Promise<T> {
    try {
      this.http.setHeaders({
        "Content-Type": "application/json",
      });
      if (typeof window !== "undefined") {
        this.http.setAuthToken(localStorage.getItem("token") || "");
      }

      // 使用POST请求代替GET请求发送数据
      const requestData = {
        origin: origin,
        destination: destination,
      };

      console.log("发送路径规划请求:", requestData);
      const res = await this.http.post("/search", requestData);

      console.log("路径规划API响应:", res.data);
      return res.data as T;
    } catch (error) {
      throw error;
    }
  }
}

export function ReplaceParentheses(str: string) {
  return str.replace(/\(/g, "%28").replace(/\)/g, "%29");
}
