import { Http } from "./axios";
import { ServerConfig } from "./site";
import UsersFunc from "./users-func";
import { UserInfoResponse } from "@/types/article";
export default class UserClient {
  private httpUser = new Http(ServerConfig.userApiUrl || "");
  private token: string | null = null;
  private usersFunc = new UsersFunc();

  constructor() {
    // 在客户端初始化时获取token
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token") || null;
  }

  setToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
    this.token = token;
  }

  async verifyToken(): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    this.httpUser.setAuthToken(this.token);

    try {
      const response = await this.httpUser.get("/validate_jwt");
      console.log(response);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async Login<T>(username: string, password: string): Promise<T> {
    // this.httpUser.setAuthToken("");
    const response = await this.httpUser.post("/login", {
      account: username,
      password: password,
    });
    return response.data as T;
  }

  async Register<T>(
    username: string,
    password: string,
    email: string,
    repeat_password: string
  ): Promise<T> {
    const response = await this.httpUser.post("/register", {
      account_password: {
        account: username,
        password: password,
      },
      email: email,
      username: username,
      repeat_password: repeat_password,
    });

    return response.data as T;
  }

  async getUserInfo<UserInfoResponse>(): Promise<UserInfoResponse> {
    const response = await this.usersFunc.getUserInfo<UserInfoResponse>();
    return response as UserInfoResponse;
  }

  async LogOut<T>(): Promise<T> {
    const userInfo = await this.getUserInfo<UserInfoResponse>();
    const response = await this.usersFunc.LogOut(userInfo);
    return response as T;
  }

  async UpdatePwd<T>(oldPwd: string, newPwd: string, repeatPwd: string): Promise<T> {
    const response = await this.usersFunc.UpdatePwd(oldPwd, newPwd, repeatPwd);
    return response as T;
  }
}
