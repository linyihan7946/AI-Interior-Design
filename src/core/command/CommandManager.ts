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
import * as EditObjectCommand from './EditObjectCommand';
import * as FurnitureCommand from './FurnitureCommand';
import { createSceneProxy, sceneUndoManager } from '../bottomClass/SceneProxyUndoManager';
import { Api } from '../Api';

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
        EditObjectCommand.register(); // 注册编辑物体命令
        FurnitureCommand.register(); // 注册插入家具命令
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

    /**
     * 命令执行统一入口
     * @param commandName 命令名称
     * @param args 命令参数
     */
    public executeCommand(commandName: string, args: any) {
        const registry = getCommandRegistry();
        const CommandCtor = registry.get(commandName);
        if (!CommandCtor) throw new Error(`Command not found: ${commandName}`);
        // 获取全局 sceneManager
        const sceneManager = Api.getApp().sceneManager;
        if (sceneManager) {
            const scene = sceneManager.getScene();
            // 用 Proxy 包裹场景树
            if (scene && !scene.__isProxy) {
                const sceneProxy = createSceneProxy(scene, sceneUndoManager);
                sceneManager.setScene(sceneProxy);
            }
        }
        const cmd = new (CommandCtor as any)(args);
        const shouldRecordUndo = (args.shouldRecordUndo === true || cmd.shouldRecordUndo === true);
        if (shouldRecordUndo) {
            sceneUndoManager.startBatch();
        }
        const result = cmd.executeCommand(args);
        if (shouldRecordUndo) {
            sceneUndoManager.endBatch();
        }
        return result;
    }
}