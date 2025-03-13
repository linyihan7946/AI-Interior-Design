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
import { XthOpening, OpeningType } from '../object/XthOpening';

@Command('createSingleDoor')
export class CreateSingleDoorCommand extends CommandBase {
    constructor() {
        super({ name: 'CreateSingleDoorCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
    }

    public executeCommand(...args: any[]): void {
        // 创建单开门实例
        const door = new XthOpening();
        door.type = OpeningType.SingleDoor;
        door.length = 900;
        door.height = 2100;
        door.thickness = 200; // 将门的厚度改为200
        door.elevation = 0;

        // 获取当前场景
        const sceneManager = Api.getApp().sceneManager;
        const scene = sceneManager.getScene();

        if (scene) {
            // 查找场景中的第一个墙体
            const walls = scene.children.filter(child => child instanceof XthWall);
            if (walls.length > 0) {
                const firstWall = walls[0] as XthWall;
                // 将门挂载到第一个墙体上
                firstWall.addChild(door);
                // 计算墙体中心位置
                const wallCenter = new THREE.Vector3().addVectors(firstWall.startPoint, firstWall.endPoint).multiplyScalar(0.5);
                // 使用 applyMatrix4 方法设置门的位置
                const matrix = new THREE.Matrix4().makeTranslation(wallCenter.x, wallCenter.y, wallCenter.z);
                door.applyMatrix4(matrix);
                door.rebuild();
                console.log('Single door created and mounted to the first wall');
            } else {
                // 如果没有墙体，直接将门添加到场景中
                scene.addChild(door);
                door.rebuild();
                console.log('Single door created and added to the scene');
            }
        } else {
            console.warn('Scene is not initialized');
        }
    }
}

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