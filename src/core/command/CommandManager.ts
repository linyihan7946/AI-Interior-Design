/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 11:34:11
 * @Description: 
 * @Version: 1.0
 */
import { CommandBase } from './CommandBase';
import * as FileCommand from './FileCommand';
import * as HouseTypeCommand from './HouseTypeCommand';
import * as AICommand from './AICommand';
import * as TestCommand from './TestCommand';
import { getCommandRegistry } from './CommandRegistry';

export class CommandManager {
    constructor() {
    }

    /**
     * 注册文件模块命令
     * @param fileCommand 文件模块命令实例
     */
    public registerFileCommands(): void {
        FileCommand.register();
        HouseTypeCommand.register();
        AICommand.register();
        TestCommand.register();
    }

    /**
     * 根据命令名获取命令类
     * @param command 命令名称
     * @returns 命令类，如果未找到则返回 undefined
     */
    public getCommand(command: string): CommandBase | undefined {
        const commandRegistry = getCommandRegistry();
        const CommandClass = commandRegistry.get(command) as new (...args: any[]) => CommandBase;
        if (CommandClass) {
            return new CommandClass(this);
        }
        return undefined;
    }
}