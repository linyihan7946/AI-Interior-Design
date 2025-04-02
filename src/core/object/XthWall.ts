/*
 * @Author: LinYiHan
 * @Date: 2025-03-04 15:57:08
 * @Description: 
 * @Version: 1.0
 */
import * as BABYLON from '@babylonjs/core';
import { JsonProperty } from "../bottomClass/Decorator";
import { XthObject } from "./XthObject";
import { ModelingTool } from '../bottomClass/ModelingTool';
import { Configure } from '../bottomClass/Configure';
import { MaterialNameList } from '../bottomClass/MaterialNameList';

export class XthWall extends XthObject {
    @JsonProperty()
    startPoint = new BABYLON.Vector3();

    @JsonProperty()
    endPoint = new BABYLON.Vector3();

    @JsonProperty()
    thickness: number = 100; // 默认厚度改为100mm

    @JsonProperty()
    height: number = 2500; // 默认高度改为2500mm

    constructor(json?: any) {
        super(json);
        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthWall',
            writable: false,
            configurable: true
        });

        // 如果没有传入颜色值，则使用 Configure 中的默认值
        if (!json || json.normalMeshColor2 === undefined) {
            ModelingTool.setColor(this.normalMeshColor2, Configure.Instance.wallMeshColor2);
        }
        if (!json || json.normalLineColor2 === undefined) {
            ModelingTool.setColor(this.normalLineColor2, Configure.Instance.wallLineColor2);
        }
        if (!json || json.normalMeshColor3 === undefined) {
            ModelingTool.setColor(this.normalMeshColor3, Configure.Instance.wallMeshColor3)
        }
        if (!json || json.normalLineColor3 === undefined) {
            ModelingTool.setColor(this.normalLineColor3, Configure.Instance.wallLineColor3);
        }
    }

    build2d(scene2: BABYLON.Scene | undefined): void {
        // 移除旧的 selfObject2
        const selfObject2 = this.getSelfObject2();
        ModelingTool.removeObject3D(selfObject2);

        // 计算墙体的长度和方向
        
        const direction = this.endPoint.subtract(this.startPoint);
        const length = direction.length();
        direction.normalize();

        // 计算墙体的中点
        
        const midPoint = this.startPoint.add(this.endPoint).multiplyByFloats(0.5, 0.5, 0.5);

        // 计算墙体的二维点集（水平方向，以中点为中心）
        const halfThickness = this.thickness / 2;
        const points = [
            new BABYLON.Vector2(-length / 2, -halfThickness),  // 左下角
            new BABYLON.Vector2(length / 2, -halfThickness),   // 右下角
            new BABYLON.Vector2(length / 2, halfThickness),    // 右上角
            new BABYLON.Vector2(-length / 2, halfThickness),   // 左上角
            new BABYLON.Vector2(-length / 2, -halfThickness),  // 回到左下角，闭合多边形
        ];

        // 调用 ModelingTool 中的接口来创建平面图形
        const material = new BABYLON.StandardMaterial(MaterialNameList.WALL_MATERIAL, scene2);
        material.diffuseColor = this.getNormalMeshColor2();
        material.emissiveColor = this.getNormalMeshColor2();
        material.disableLighting = true;
        material.backFaceCulling = false;
        const planeShape = ModelingTool.CreateShapeGeometry([points], scene2);
        planeShape.material = material;

        // 构造变换矩阵
        const angle = Math.atan2(direction.y, direction.x);
        
        const rotationMatrix = BABYLON.Matrix.RotationZ(-angle);
        const translationMatrix = BABYLON.Matrix.Translation(midPoint.x, midPoint.y, midPoint.z);
        const transformMatrix = rotationMatrix.multiply(translationMatrix);

        // 将建模后的物体添加到 selfObject2
        planeShape.parent = selfObject2;

        // 应用变换矩阵到 planeShape
        ModelingTool.applyMatrix4(planeShape, transformMatrix);
    }

    build3d(scene3: BABYLON.Scene | undefined): void {
        if (!scene3) {
            console.warn('Scene is undefined in build3d');
            return;
        }

        // 移除旧的 selfObject3
        const selfObject3 = this.getSelfObject3();
        ModelingTool.removeObject3D(selfObject3);

        // 计算墙体的长度和方向
        const direction = this.endPoint.subtract(this.startPoint);
        const length = direction.length();
        direction.normalize();

        // 计算墙体的中点
        const midPoint = this.startPoint.add(this.endPoint).multiplyByFloats(0.5, 0.5, 0.0);

        // 定义拉伸轮廓的二维点集（水平方向，以中点为中心）
        const halfThickness = this.thickness / 2;
        const points = [
            new BABYLON.Vector2(-length / 2, -halfThickness),  // 左下角
            new BABYLON.Vector2(length / 2, -halfThickness),   // 右下角
            new BABYLON.Vector2(length / 2, halfThickness),    // 右上角
            new BABYLON.Vector2(-length / 2, halfThickness),   // 左上角
            new BABYLON.Vector2(-length / 2, -halfThickness)   // 回到左下角，闭合多边形
        ];

        // 定义拉伸深度
        const depth = this.height;

        // 使用配置中的墙面贴图
        const texture = new BABYLON.Texture(Configure.Instance.wallTexturePath, scene3);
        const material = new BABYLON.StandardMaterial(MaterialNameList.WALL_MATERIAL, scene3);
        material.diffuseTexture = texture;
        material.emissiveTexture = texture;
        material.disableLighting = true;
        material.backFaceCulling = false;

        // 调用 ModelingTool 中的接口来创建拉伸造型
        const extrudedShape = ModelingTool.createExtrudedShape(points, depth, material, scene3);

        // 使用 setAutoUV 函数设置UV
        // ModelingTool.setAutoUV(extrudedShape.geometry);

        // 构造变换矩阵
        const angle = Math.atan2(direction.y, direction.x);
        const rotationMatrix = BABYLON.Matrix.RotationZ(-angle);
        const translationMatrix = BABYLON.Matrix.Translation(midPoint.x, midPoint.y, midPoint.z);
        const transformMatrix = rotationMatrix.multiply(translationMatrix);

        // 将建模后的物体添加到 selfObject3
        extrudedShape.parent = selfObject3;

        // 应用变换矩阵到 extrudedShape
        ModelingTool.applyMatrix4(extrudedShape, transformMatrix);
    }
}