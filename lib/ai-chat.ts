/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-10 15:57:17
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-11 09:39:38
 * @FilePath: \dalieba\lib\ai-chat.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Http } from "@/lib/axios";
import { ServerConfig } from "./site";

export default class AiChat {
  private http = new Http(ServerConfig.AiApiUrl);

  public async guideScenicSpot<T>(ScenicSpot: string, user_id: string): Promise<T> {
    const res = await this.http.get(`/guide?spot=${ScenicSpot}&user_id=${user_id}`);
    return res.data as T;
  }

  public async createPlan<T>(userId: string, message: string, city: string, title: string): Promise<T> {
    const res = await this.http.post(``, {
      user_id: userId,
      message,
      city,
      title
    });
    return res.data as T;
  }

  public async getPlans<T>(userId: string): Promise<T> {
    const res = await this.http.get(`/get_chat_history?user_id=${userId}`);
    return res.data as T;
  }

  public async getPlan<T>(userId: string, title: string): Promise<T> {
    const res = await this.http.get(`/get_chat_history_by_title?user_id=${userId}&title=${title}`);
    return res.data as T;
  }
}
