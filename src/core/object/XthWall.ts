/*
 * @Author: LinYiHan
 * @Date: 2025-03-04 15:57:08
 * @Description: 
 * @Version: 1.0
 */
import * as THREE from 'three';
import { JsonProperty } from "../bottomClass/Decorator";
import { XthObject } from "./XthObject";
import { ModelingTool } from '../bottomClass/ModelingTool';
import { Configure } from '../bottomClass/Configure';

export class XthWall extends XthObject {
    @JsonProperty()
    startPoint: THREE.Vector3 = new THREE.Vector3();

    @JsonProperty()
    endPoint: THREE.Vector3 = new THREE.Vector3();

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
            this.normalMeshColor2 = Configure.Instance.wallMeshColor2;
        }
        if (!json || json.normalLineColor2 === undefined) {
            this.normalLineColor2 = Configure.Instance.wallLineColor2;
        }
        if (!json || json.normalMeshColor3 === undefined) {
            this.normalMeshColor3 = Configure.Instance.wallMeshColor3;
        }
        if (!json || json.normalLineColor3 === undefined) {
            this.normalLineColor3 = Configure.Instance.wallLineColor3;
        }
    }

    build2d(): void {
        // 移除旧的 selfObject2
        const selfObject2 = this.getSelfObject2();
        ModelingTool.removeObject3D(selfObject2);

        // 计算墙体的长度和方向
        const direction = new THREE.Vector3().subVectors(this.endPoint, this.startPoint);
        const length = direction.length();
        direction.normalize();

        // 计算墙体的二维点集
        const halfThickness = this.thickness / 2;
        const points = [
            new THREE.Vector2(0, -halfThickness),
            new THREE.Vector2(0, halfThickness),
            new THREE.Vector2(length, halfThickness),
            new THREE.Vector2(length, -halfThickness),
            new THREE.Vector2(0, -halfThickness),
        ];

        // 调用 ModelingTool 中的接口来创建平面图形
        const planeShape = ModelingTool.createPlaneShape(
            points,
            new THREE.MeshBasicMaterial({ color: this.getNormalMeshColor2(), side: THREE.DoubleSide })
        );

        // 将墙体旋转到正确的位置
        const angle = Math.atan2(direction.y, direction.x);
        planeShape.rotation.z = -angle;

        // 将墙体平移到正确的位置
        planeShape.position.copy(this.startPoint);
        planeShape.updateMatrixWorld(true);

        // 将建模后的物体添加到 selfObject2
        selfObject2.add(planeShape);
    }

    build3d(): void {
        // 移除旧的 selfObject3
        const selfObject3 = this.getSelfObject3();
        ModelingTool.removeObject3D(selfObject3);

        // 计算墙体的长度和方向
        const direction = new THREE.Vector3().subVectors(this.endPoint, this.startPoint);
        const length = direction.length();
        direction.normalize();

        // 定义拉伸轮廓的二维点集
        const halfThickness = this.thickness / 2;
        const points = [
            new THREE.Vector2(0, -halfThickness),
            new THREE.Vector2(0, halfThickness),
            new THREE.Vector2(length, halfThickness),
            new THREE.Vector2(length, -halfThickness)
        ];
        // 定义拉伸深度
        const depth = this.height;
        // 定义材质
        const material = new THREE.MeshBasicMaterial({ color: this.getNormalMeshColor3() });

        // 调用 ModelingTool 中的接口来创建拉伸造型
        const extrudedShape = ModelingTool.createExtrudedShape(points, depth, material);

        // 将墙体旋转到正确的位置
        const angle = Math.atan2(direction.y, direction.x);
        extrudedShape.rotation.z = -angle;

        // 将墙体平移到正确的位置
        extrudedShape.position.copy(this.startPoint);

        // 将建模后的物体添加到 selfObject3
        selfObject3.add(extrudedShape);
    }
}