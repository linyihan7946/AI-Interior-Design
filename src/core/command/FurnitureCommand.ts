/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 11:34:11
 * @Description: 插入家具命令
 * @Version: 1.0
 */
import * as BABYLON from '@babylonjs/core';
import { CommandBase } from './CommandBase';
import { Command } from './CommandRegistry';
import { XthFurniture } from '../object/XthFurniture';
import { Api } from '../Api';
import { TemporaryVariable } from '../TemporaryVariable';

@Command('insertFurniture')
export class InsertFurnitureCommand extends CommandBase {
    constructor() {
        super({ name: 'InsertFurnitureCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
    }

    public executeCommand(args: { position: { x: number, y: number, z: number }, name: string }): void {
        const { position, name } = args;

        // 创建家具实例
        const furniture = new XthFurniture();
        furniture.setFurnitureInfo({
            dbId: '', // 可以根据需要生成或获取
            name: name,
            gltfUrl: '' // 可以根据需要设置GLTF模型URL
        });

        // 获取当前场景
        const sceneManager = Api.getApp().sceneManager;
        const scene = sceneManager.getScene();

        if (scene) {
            // 设置家具位置
            const matrix = BABYLON.Matrix.Translation(position.x, position.y, position.z);
            furniture.applyMatrix4(matrix);

            // 将家具添加到场景中
            scene.addChild(furniture);
            furniture.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);
            console.log('Furniture inserted into the scene');
        } else {
            console.warn('Scene is not initialized');
        }
    }
}

export function register(): void {
    // 注册命令
}