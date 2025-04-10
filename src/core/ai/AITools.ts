/*
 * @Author: LinYiHan
 * @Date: 2025-04-09 17:55:20
 * @Description: 
 * @Version: 1.0
 */

import { Api } from "../Api";

/**
 * 解析大语言模型返回的 API 执行文本
 * @param responseText 大语言模型返回的文本
 * @returns 解析后的对象或字符串
 */
export function parseLLMResponse(responseText: string): any {
    // 返回格式
    /* {
            "action": "executeCommand", 
            "parameters": {
                "commandName": "createRectangularRoom", 
                "commandParams": {
                }
            }
        }
    */
    const parsedCommand = JSON.parse(responseText);
    if (parsedCommand.action === "executeCommand") {
        const parameters = parsedCommand.parameters;
        if (!parameters || !parameters.commandName) {
            return;
        }
        const result = Api.getApp().executeCommand(parsedCommand.parameters.commandName, parsedCommand.parameters.commandParams);
        return result;
    }
}