/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 11:34:11
 * @Description: 
 * @Version: 1.0
 */
import { SceneManager } from '../manager/SceneManager';
import { CommandBase } from './CommandBase';
import { Command } from './CommandRegistry';
import { Api } from '../Api';

@Command('openScene')
export class OpenSceneCommand extends CommandBase {
    private sceneManager: SceneManager;

    constructor() {
        super({ name: 'OpenSceneCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
        this.sceneManager = Api.getApp().sceneManager;
    }

    public executeCommand(sceneData: any): void {
        this.sceneManager.setScene(sceneData);
    }
}

@Command('loadScene')
export class LoadSceneCommand extends CommandBase {
    private sceneManager: SceneManager;

    constructor() {
        super({ name: 'LoadSceneCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
        this.sceneManager = Api.getApp().sceneManager;
    }

    public executeCommand(sceneData: any): any {
        return this.sceneManager.load(sceneData);
    }
}

@Command('saveSceneToLocal')
export class SaveSceneToLocalCommand extends CommandBase {
    private sceneManager: SceneManager;

    constructor() {
        super({ name: 'SaveSceneToLocalCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
        this.sceneManager = Api.getApp().sceneManager;
    }

    public executeCommand(param: any): any {
        return this.sceneManager.saveLocal(param);
    }
}

@Command('newFile')
export class NewFileCommand extends CommandBase {
    private sceneManager: SceneManager;

    constructor() {
        super({ name: 'NewFileCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
        this.sceneManager = Api.getApp().sceneManager;
    }

    public executeCommand(): void {
        this.sceneManager.newFile();
        const scene = this.sceneManager.getScene();
    }
}

export function register(): void {
    // 空函数，不做任何操作
}