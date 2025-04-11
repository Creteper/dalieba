import { Http } from "@/lib/axios";
import { ServerConfig } from "./site";

export default class ScenicSpot {
  private http = new Http(ServerConfig.userApiUrl);

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
    const res = await this.http.get(`/keyword_search/keyword?keyword=${keyword}`);
    return res.data as T;
  }

}
