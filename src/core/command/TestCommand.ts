/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 16:46:59
 * @Description: 
 * @Version: 1.0
 */
import { CommandBase } from './CommandBase';
import { Command } from './CommandRegistry';
import { TestUtils } from '../test/TestUtils';

@Command('test')
export class TestCommand extends CommandBase {
    constructor() {
        super({ name: 'TestCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
    }

    public executeCommand(args: any): void {
        // 调用 TestUtils 的测试方法
        TestUtils.test();
        console.log('Test command executed');
    }
}

export function register(): void {
    // 空函数，用于注册命令
}