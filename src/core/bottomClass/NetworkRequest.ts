/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 14:17:22
 * @Description: 通用的网络请求类，使用 fetch 实现 get 和 post 方法
 * @Version: 1.0
 */
export class NetworkRequest {
    /**
     * 发送 GET 请求
     * @param url 请求的 URL
     * @param headers 请求头
     * @returns 返回 Promise 对象，包含响应数据
     */
    public static async get(url: string, headers: Record<string, string> = {}): Promise<any> {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error during GET request:', error);
            throw error;
        }
    }

    /**
     * 发送 POST 请求
     * @param url 请求的 URL
     * @param data 请求体数据
     * @param headers 请求头
     * @returns 返回 Promise 对象，包含响应数据
     */
    public static async post(url: string, data: any, headers: Record<string, string> = {}): Promise<any> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error during POST request:', error);
            throw error;
        }
    }
}