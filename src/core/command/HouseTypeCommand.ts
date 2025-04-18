/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 16:46:59
 * @Description: 
 * @Version: 1.0
 */
import * as BABYLON from '@babylonjs/core';
import { CommandBase } from './CommandBase';
import { Command } from './CommandRegistry';
import { Api } from '../Api';
import { XthWall } from '../object/XthWall';
import { XthOpening } from '../object/XthOpening';
import { XthGround } from '../object/XthGround';
import { XthCompositeLine } from '../object/XthCompositeLine';
import { ModelingTool } from '../bottomClass/ModelingTool';
import { OpeningType } from '../enum/OpeningType';
import { TemporaryVariable } from '../bottomClass/TemporaryVariable';
import { XthLine } from '../object/XthLine';
import { XthObject } from '../object/XthObject';

@Command('createSingleDoor')
export class CreateSingleDoorCommand extends CommandBase {
    constructor() {
        super({ name: 'CreateSingleDoorCommand', shouldRecordUndo: true, shouldCancelPreviousCommand: false });
    }

    public executeCommand(args: any): void {
        // 解析传入的参数
        const {type, width, height, thickness, elevation, position} = args;

        // 创建门实例
        const door = new XthOpening();
        door.type = type;
        door.length = width;
        door.height = height;
        door.thickness = thickness;
        door.elevation = elevation;

        // 获取当前场景
        const sceneManager = Api.getApp().sceneManager;
        const scene = sceneManager.getScene();

        if (scene) {
            // 获取当前选中的物体
            const selectedObject = sceneManager.getSelectedObject();
            if (selectedObject && selectedObject.isKindOf('XthWall')) {
                const wall = selectedObject as XthWall;
                
                // 计算门的位置
                const matrix = BABYLON.Matrix.Translation(position.x, position.y, position.z);
                door.applyMatrix4(matrix);
                door.dockToWall(wall);
                // 将门挂载到指定墙体上
                wall.addChild(door);
                door.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);
                console.log('Door created and mounted to the specified wall');
            } else {
                console.warn('No wall selected or the selected object is not a wall');
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

    public executeCommand(args: any): void {
        // 创建墙体实例
        const wall = new XthWall();
        wall.startPoint = new BABYLON.Vector3(0, 0, 0);
        wall.endPoint = new BABYLON.Vector3(4000, 0, 0);
        wall.thickness = 120;
        wall.height = 2800;

        // 获取当前场景
        const sceneManager = Api.getApp().sceneManager;
        const scene = sceneManager.getScene();

        // 将墙体添加到场景中
        if (scene) {
            scene.addChild(wall);
            wall.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);
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

    public executeCommand(args: any): void {
        // 创建地面实例
        const ground = new XthGround();
        const outline = new XthCompositeLine();
        outline.addPoint(new BABYLON.Vector3(0, 0, 0));
        outline.addPoint(new BABYLON.Vector3(4000, 0, 0));
        outline.addPoint(new BABYLON.Vector3(4000, 3000, 0));
        outline.addPoint(new BABYLON.Vector3(0, 3000, 0));
        outline.addPoint(new BABYLON.Vector3(0, 0, 0));
        ground.setOutline(outline);

        // 获取当前场景
        const sceneManager = Api.getApp().sceneManager;
        const scene = sceneManager.getScene();

        // 将地面添加到场景中
        if (scene) {
            scene.addChild(ground);
            ground.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);
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

    public executeCommand(args: any): void {
        const sceneManager = Api.getApp().sceneManager;
        const scene = sceneManager.getScene();

        if (!scene) {
            console.warn('Scene is not initialized');
            return;
        }

        // 原点在左下方

        // 创建四面墙
        const wallLength = 4000;
        const wallHeight = 2800;
        const wallThickness = 120;

        const leftWall = new XthWall();
        leftWall.startPoint = new BABYLON.Vector3(-wallThickness / 2, 0, 0);
        leftWall.endPoint = new BABYLON.Vector3(-wallThickness / 2, wallLength, 0);
        leftWall.thickness = wallThickness;
        leftWall.height = wallHeight;

        const rightWall = new XthWall();
        rightWall.startPoint = new BABYLON.Vector3(wallLength + wallThickness / 2, 0, 0);
        rightWall.endPoint = new BABYLON.Vector3(wallLength + wallThickness / 2, wallLength, 0);
        rightWall.thickness = wallThickness;
        rightWall.height = wallHeight;

        const topWall = new XthWall();
        topWall.startPoint = new BABYLON.Vector3(0, wallLength + wallThickness / 2, 0);
        topWall.endPoint = new BABYLON.Vector3(wallLength, wallLength + wallThickness / 2, 0);
        topWall.thickness = wallThickness;
        topWall.height = wallHeight;

        const bottomWall = new XthWall();
        bottomWall.startPoint = new BABYLON.Vector3(0, -wallThickness / 2, 0);
        bottomWall.endPoint = new BABYLON.Vector3(wallLength, -wallThickness / 2, 0);
        bottomWall.thickness = wallThickness;
        bottomWall.height = wallHeight;

        scene.addChild(leftWall);
        scene.addChild(rightWall);
        scene.addChild(topWall);
        scene.addChild(bottomWall);

        // 创建地面
        const ground = new XthGround();
        const outline = new XthCompositeLine();
        outline.addLine(new XthLine({startPt: [0, 0, 0], endPt: [wallLength, 0, 0]}));
        outline.addLine(new XthLine({startPt: [wallLength, 0, 0], endPt: [wallLength, wallLength, 0]}));
        outline.addLine(new XthLine({startPt: [wallLength, wallLength, 0], endPt: [0, wallLength, 0]}));
        outline.addLine(new XthLine({startPt: [0, wallLength, 0], endPt: [0, 0, 0]}));
        ground.setOutline(outline);
        scene.addChild(ground);

        // 在左边的墙上中间位置添加一个单开门
        // const door = new XthOpening();
        // door.type = OpeningType.SingleDoor;
        // door.length = 900;
        // door.height = 2100;
        // door.thickness = 300;
        // door.elevation = 0;

        // const wallCenter = leftWall.startPoint.add(leftWall.endPoint).multiplyByFloats(0.5, 0.5, 0.5);
        // const matrix = BABYLON.Matrix.Translation(wallCenter.x, wallCenter.y, wallCenter.z);
        
        // door.applyMatrix4(matrix);
        // door.dockToWall(leftWall);
        // leftWall.addChild(door);

        // 重建所有对象
        leftWall.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);
        rightWall.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);
        topWall.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);
        bottomWall.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);
        ground.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);
        // door.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);

        console.log('Rectangular room created with a single door on the left wall');
    }
}

export function register(): void {
    // 空函数，用于注册命令
}