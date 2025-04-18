/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-21 16:51:58
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-04-17 20:10:21
 * @FilePath: \dalieba\lib\axios.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";
export class Http {
  private headers: any;
  constructor(private baseUrl: string) {
    this.baseUrl = baseUrl;
    this.headers = {};
  }
  setHeaders(headers: any) {
    this.headers = headers;
  }
  setAuthToken(token: string) {
    this.headers.Authorization = `Bearer ${token}`;
  }
  async get(url: string, params: any | null = null) {
    const response = await axios.get(`${this.baseUrl}${url}`, {
      headers: this.headers,
      params: params,
    });
    return response;
  }
  async post(url: string, data: any) {
    const response = await axios.post(`${this.baseUrl}${url}`, data, {
      headers: this.headers,
    });
    return response;
  }
  async put(url: string, data: any) {
    const response = await axios.put(`${this.baseUrl}${url}`, data, {
      headers: this.headers,
    });
    return response;
  }
  async delete(url: string) {
    const response = await axios.delete(`${this.baseUrl}${url}`, {
      headers: this.headers,
    });
    return response;
  }

  // 添加通用request方法，支持完整的axios配置
  async request(config: any) {
    const fullConfig = {
      ...config,
      url: `${this.baseUrl}${config.url}`,
      headers: { ...this.headers, ...(config.headers || {}) },
    };

    const response = await axios(fullConfig);
    return response;
  }
}
