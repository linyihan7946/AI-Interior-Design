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
import { XthGround } from '../object/XthGround';
import { XthCompositeLine } from '../object/XthCompositeLine';

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
        door.thickness = 400; // 将门的厚度改为200
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

@Command('createGround')
export class CreateGroundCommand extends CommandBase {
    constructor() {
        super({ name: 'CreateGroundCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
    }

    public executeCommand(...args: any[]): void {
        // 创建地面实例
        const ground = new XthGround();
        const outline = new XthCompositeLine();
        outline.addPoint(new THREE.Vector3(0, 0, 0));
        outline.addPoint(new THREE.Vector3(4000, 0, 0));
        outline.addPoint(new THREE.Vector3(4000, 3000, 0));
        outline.addPoint(new THREE.Vector3(0, 3000, 0));
        outline.addPoint(new THREE.Vector3(0, 0, 0));
        ground.setOutline(outline);

        // 获取当前场景
        const sceneManager = Api.getApp().sceneManager;
        const scene = sceneManager.getScene();

        // 将地面添加到场景中
        if (scene) {
            scene.addChild(ground);
            ground.rebuild();
            console.log('Ground created and added to the scene');
        } else {
            console.warn('Scene is not initialized');
        }
    }
}

@Command('createRectangularRoom')
export class CreateRectangularRoomCommand extends CommandBase {
    constructor() {
        super({ name: 'CreateRectangularRoomCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
    }

    public executeCommand(...args: any[]): void {
        const sceneManager = Api.getApp().sceneManager;
        const scene = sceneManager.getScene();

        if (!scene) {
            console.warn('Scene is not initialized');
            return;
        }

        // 创建四面墙
        const wallLength = 4000;
        const wallHeight = 2800;
        const wallThickness = 120;

        const leftWall = new XthWall();
        leftWall.startPoint = new THREE.Vector3(-wallThickness / 2, 0, 0);
        leftWall.endPoint = new THREE.Vector3(-wallThickness / 2, wallLength, 0);
        leftWall.thickness = wallThickness;
        leftWall.height = wallHeight;

        const rightWall = new XthWall();
        rightWall.startPoint = new THREE.Vector3(wallLength + wallThickness / 2, 0, 0);
        rightWall.endPoint = new THREE.Vector3(wallLength + wallThickness / 2, wallLength, 0);
        rightWall.thickness = wallThickness;
        rightWall.height = wallHeight;

        const topWall = new XthWall();
        topWall.startPoint = new THREE.Vector3(0, wallLength + wallThickness / 2, 0);
        topWall.endPoint = new THREE.Vector3(wallLength, wallLength + wallThickness / 2, 0);
        topWall.thickness = wallThickness;
        topWall.height = wallHeight;

        const bottomWall = new XthWall();
        bottomWall.startPoint = new THREE.Vector3(0, -wallThickness / 2, 0);
        bottomWall.endPoint = new THREE.Vector3(wallLength, -wallThickness / 2, 0);
        bottomWall.thickness = wallThickness;
        bottomWall.height = wallHeight;

        scene.addChild(leftWall);
        scene.addChild(rightWall);
        scene.addChild(topWall);
        scene.addChild(bottomWall);

        // 创建地面
        const ground = new XthGround();
        const outline = new XthCompositeLine();
        outline.addPoint(new THREE.Vector3(0, 0, 0));
        outline.addPoint(new THREE.Vector3(wallLength, 0, 0));
        outline.addPoint(new THREE.Vector3(wallLength, wallLength, 0));
        outline.addPoint(new THREE.Vector3(0, wallLength, 0));
        outline.addPoint(new THREE.Vector3(0, 0, 0));
        ground.setOutline(outline);
        scene.addChild(ground);

        // 在左边的墙上中间位置添加一个单开门
        const door = new XthOpening();
        door.type = OpeningType.SingleDoor;
        door.length = 900;
        door.height = 2100;
        door.thickness = 200;
        door.elevation = 0;

        const wallCenter = new THREE.Vector3().addVectors(leftWall.startPoint, leftWall.endPoint).multiplyScalar(0.5);
        const matrix = new THREE.Matrix4().makeTranslation(wallCenter.x, wallCenter.y, wallCenter.z);
        door.applyMatrix4(matrix);
        // 调用停靠墙体函数
        door.dockToWall(leftWall);
        leftWall.addChild(door);

        // 重建所有对象
        leftWall.rebuild();
        rightWall.rebuild();
        topWall.rebuild();
        bottomWall.rebuild();
        ground.rebuild();
        door.rebuild();

        console.log('Rectangular room created with a single door on the left wall');
    }
}

export function register(): void {
    // 空函数，用于注册命令
}