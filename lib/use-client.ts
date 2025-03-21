import { Http } from "./axios";
import { ServerConfig } from "./site";
export default class UserClient {
  private httpUser = new Http( ServerConfig.userApiUrl || '');
  private token: string | null = null;

  constructor() {
    // 在客户端初始化时获取token
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }
  
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token') || null;
  }

  setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
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
      return true;
    } catch (error) {
      console.error("验证token失败:", error);
      return false;
    }
  }

  async Login(username: string, password: string) {
    this.httpUser.setAuthToken("");
    const response = await this.httpUser.post("/login", {
      account: username,
      password: password,
  });
  return response;
  }
}