/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-18 18:04:57
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-11 12:39:04
 * @FilePath: \dalieba\lib\users-func.ts
 * @Description: 用户功能封装
 */

import { Http } from "./axios";
import { ServerConfig } from "./site";
import { UserInfoResponse } from "@/types/article";
export default class UsersFunc {
  private http = new Http(ServerConfig.userApiUrl);
  private verTokenHttp = new Http(ServerConfig.userApiUrl);

  public async LogOut<T>(userInfo: UserInfoResponse): Promise<T> {
    console.log("退出");
    localStorage.removeItem("token");
    const res = await this.http.post("/log_out", {
      user_id: userInfo.user_id,
      username: userInfo.username,
      email: userInfo.email,
      account_number: userInfo.account_number,
    });

    return res as T;
  }

  public async verifyRevoked<T>(
    username: string,
    password: string
  ): Promise<T> {
    const res = await this.http.get("/verify_revoked");

    return res as T;
  }

  public async getUserInfo<T>(): Promise<T> {
    this.verTokenHttp.setAuthToken(localStorage.getItem("token") || "");
    const res = await this.verTokenHttp.post("/get_user_info", {});

    return res.data as T;
  }

  public async UpdatePwd<T>(oldPwd: string, newPwd: string, repeatPwd: string): Promise<T> {
    this.verTokenHttp.setAuthToken(localStorage.getItem("token") || "");
    const res = await this.verTokenHttp.post("/update_password", {
      old_password: oldPwd,
      new_password: newPwd,
      repeat_password: repeatPwd,
    });

    return res as T;
  }
}
