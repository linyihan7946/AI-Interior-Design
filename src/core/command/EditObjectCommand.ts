/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 11:34:11
 * @Description: 编辑物体命令
 * @Version: 1.0
 */
import { CommandBase } from './CommandBase';
import { Command } from './CommandRegistry';
import { Api } from '../Api';
import { SceneManager } from '../manager/SceneManager';

@Command('getSelectedObjectInfo')
export class GetSelectedObjectInfoCommand extends CommandBase {
    constructor() {
        super({ name: 'GetSelectedObjectInfoCommand', shouldRecordUndo: false, shouldCancelPreviousCommand: false });
    }

    public executeCommand(): any {
        const selectedObject = Api.getApp().sceneManager.getSelectedObject();
        if (selectedObject) {
            return selectedObject.toJSON();
        } else {
            return undefined;
        }
    }
}

@Command('deleteSelectedObject')
export class DeleteSelectedObjectCommand extends CommandBase {
    constructor() {
        super({ name: 'DeleteSelectedObjectCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
    }

    public executeCommand(): void {
        const sceneManager = Api.getApp().sceneManager;
        const selectedObject = sceneManager.getSelectedObject();
        if (selectedObject) {
            // 从场景中移除选中的物体
            selectedObject.remove();
            // 取消选中
            sceneManager.deselectObject();
            console.log('Selected object deleted');
        } else {
            console.warn('No object selected');
        }
    }
}

export function register(): void {
    // 注册命令
}