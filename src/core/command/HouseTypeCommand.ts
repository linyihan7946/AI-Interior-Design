/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 16:46:59
 * @Description: 
 * @Version: 1.0
 */
import * as THREE from 'three';
import { CommandBase } from './CommandBase';
import { Command } from './CommandRegistry';
import { Api } from '../Api';
import { XthWall } from '../object/XthWall';

@Command('createOneWall')
export class CreateOneWallCommand extends CommandBase {
    constructor() {
        super({ name: 'CreateOneWallCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
    }

    public executeCommand(...args: any[]): void {
        // 创建墙体实例
        const wall = new XthWall();
        wall.startPoint = new THREE.Vector3(0, 0, 0);
        wall.endPoint = new THREE.Vector3(4000, 0, 0);
        wall.thickness = 120;
        wall.height = 2800;

        // 获取当前场景
        const sceneManager = Api.getApp().sceneManager;
        const scene = sceneManager.getScene();

        // 将墙体添加到场景中
        if (scene) {
            scene.addChild(wall);
            wall.rebuild();
            console.log('Wall created and added to the scene');
        } else {
            console.warn('Scene is not initialized');
        }
    }
}

export function register(): void {
    // 空函数，用于注册命令
}