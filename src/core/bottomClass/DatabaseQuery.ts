/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 16:46:59
 * @Description: 通用的数据库查询接口类
 * @Version: 1.0
 */
import { NetworkRequest } from './NetworkRequest';

export class DatabaseQuery {
    private baseUrl: string;

    /**
     * 构造函数
     * @param baseUrl 数据库API的基础URL
     */
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * 执行查询操作
     * @param endpoint 查询的API端点
     * @param params 查询参数
     * @returns 返回查询结果
     */
    public async query(endpoint: string, params: Record<string, any> = {}): Promise<any> {
        const url = `${this.baseUrl}/${endpoint}`;
        return await NetworkRequest.get(url, params);
    }

    /**
     * 执行插入操作
     * @param endpoint 插入的API端点
     * @param data 插入的数据
     * @returns 返回插入结果
     */
    public async insert(endpoint: string, data: Record<string, any>): Promise<any> {
        const url = `${this.baseUrl}/${endpoint}`;
        return await NetworkRequest.post(url, data);
    }

    /**
     * 执行更新操作
     * @param endpoint 更新的API端点
     * @param data 更新的数据
     * @returns 返回更新结果
     */
    public async update(endpoint: string, data: Record<string, any>): Promise<any> {
        const url = `${this.baseUrl}/${endpoint}`;
        return await NetworkRequest.post(url, data);
    }

    /**
     * 执行删除操作
     * @param endpoint 删除的API端点
     * @param params 删除参数
     * @returns 返回删除结果
     */
    public async delete(endpoint: string, params: Record<string, any> = {}): Promise<any> {
        const url = `${this.baseUrl}/${endpoint}`;
        return await NetworkRequest.get(url, params);
    }
}