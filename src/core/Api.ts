/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 14:17:22
 * @Description: 
 * @Version: 1.0
 */
import { Application } from './Application';
import { Configure } from './bottomClass/Configure';

export class Api {
    private static app: Application;

    /**
     * 初始化应用程序
     * @param param 初始化参数
     */
    public static init(param?: { view3dId?: string; view2dId?: string }): void {
        this.app = new Application(param);
        this.app.initialize();
    }

    /**
     * 释放应用程序资源
     */
    public static dispose(): void {
        this.app.dispose();
    }

    /**
     * 获取当前的应用程序实例
     * @returns 当前的应用程序实例
     */
    public static getApp(): Application {
        return this.app;
    }

    /**
     * 执行命令
     * @param command 命令名称
     * @param data 命令参数
     */
    public static executeCommand(command: string, data: any): void {
        this.app.executeCommand(command, data);
    }

    /**
     * 解析大语言模型返回的 API 执行文本
     * @param responseText 大语言模型返回的文本
     * @returns 解析后的对象或字符串
     */
    public static parseLLMResponse(responseText: string): any {
        if (!responseText) {
            return;
        }
        const info = JSON.parse(responseText);
        const result = this.app.executeCommand(info.command, info.parameters);
        return result;
        // if (parsedCommand.action === "executeCommand") {
        //     const parameters = parsedCommand.parameters;
        //     if (!parameters || !parameters.commandName) {
        //         return;
        //     }
        //     const result = this.app.executeCommand(parsedCommand.parameters.commandName, parsedCommand.parameters.commandParams);
        //     return result;
        // }
    }
}