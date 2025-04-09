/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 11:34:11
 * @Description: AI 对话命令
 * @Version: 1.0
 */
import { NetworkRequest } from '../bottomClass/NetworkRequest';
import { CommandBase } from './CommandBase';
import { Command } from './CommandRegistry';

@Command('aiChat')
export class AIChatCommand extends CommandBase {
    constructor() {
        super({ name: 'AIChatCommand', shouldRecordUndo: false, shouldCancelPreviousCommand: false });
    }

    public async executeCommand(Content: string): Promise<any> {
        const params = {
            Model: "deepseek-v3", // 默认模型
            Messages: [
                {
                    Role: "user",
                    Content
                }
            ],
            Stream: true // 默认使用流式响应
        };
        // 目前由本地的后端服务提供
        return NetworkRequest.post('http://sjtest.yfway.com:3001/llm-api', params);
    }
}

export function register(): void {
    // 空函数，不做任何操作
}