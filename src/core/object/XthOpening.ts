/*
 * @Author: LinYiHan
 * @Date: 2025-03-04 16:36:28
 * @Description: 
 * @Version: 1.0
 */
import * as THREE from 'three';
import { XthObject } from './XthObject';
import { JsonProperty } from '../bottomClass/Decorator';
import { ModelingTool } from '../bottomClass/ModelingTool';
import { Configure } from '../bottomClass/Configure';

export enum OpeningType {
    SingleDoor = 0,
    DoubleDoor = 1,
    MotherChildDoor = 2,
    SlidingDoor = 3,
    BalconyDoor = 4,
    StraightWindow = 5,
    BayWindow = 6
}

export class XthOpening extends XthObject {
    @JsonProperty()
    elevation: number = 0; // 默认高度为0mm

    @JsonProperty()
    height: number = 2100; // 默认高度改为2100mm

    @JsonProperty()
    type: OpeningType = OpeningType.SingleDoor;

    @JsonProperty()
    length: number = 900; // 默认长度改为900mm

    @JsonProperty()
    thickness: number = 100; // 默认厚度改为100mm

    constructor(json?: any) {
        super(json);
        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthOpening',
            writable: false,
            configurable: true
        });
    }

    build2d(): void {
        const selfObject2 = this.getSelfObject2();
        ModelingTool.removeObject3D(selfObject2);

        const points = this.get2DPoints();
        const material = new THREE.MeshBasicMaterial({ color: this.getNormalMeshColor2(), side: THREE.DoubleSide });

        const planeShape = ModelingTool.createPlaneShape(points, material);
        
        selfObject2.add(planeShape);
    }

    build3d(): void {
        const selfObject3 = this.getSelfObject3();
        ModelingTool.removeObject3D(selfObject3);

        const gltfPath = Configure.Instance.gltfPaths[this.type];
        if (gltfPath) {
            ModelingTool.loadGLTF(gltfPath).then((model) => {
                // 获取模型的边界框
                const box = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3();
                box.getSize(size);

                // 根据模型的默认尺寸和门窗的实际尺寸计算缩放比例
                const scale = new THREE.Vector3(
                    this.length / size.x, // 根据实际长度和模型默认长度进行缩放
                    this.thickness / size.y, // 根据实际高度和模型默认高度进行缩放
                    this.height / size.z // 根据实际厚度和模型默认厚度进行缩放
                );
                model.scale.copy(scale); // 应用缩放比例
                selfObject3.add(model);
            }).catch((error) => {
                console.error('Failed to load GLTF model:', error);
                // 如果加载失败，使用默认的拉伸造型
                const points = this.get3DPoints();
                const height = this.height;
                const material = new THREE.MeshBasicMaterial({ color: this.getNormalMeshColor3() });
                const extrudedShape = ModelingTool.createExtrudedShape(points, height, material);
                selfObject3.add(extrudedShape);
            });
        } else {
            // 如果没有配置 GLTF 路径，使用默认的拉伸造型
            const points = this.get3DPoints();
            const height = this.height;
            const material = new THREE.MeshBasicMaterial({ color: this.getNormalMeshColor3() });
            const extrudedShape = ModelingTool.createExtrudedShape(points, height, material);
            selfObject3.add(extrudedShape);
        }
    }

    private get2DPoints(): THREE.Vector2[] {
        const halfLength = this.length / 2;
        const halfThickness = this.thickness / 2;  // 使用厚度的一半代替高度的一半

        switch (this.type) {
            case OpeningType.SingleDoor:
                // 单开门：矩形
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, -halfThickness)
                ];
            case OpeningType.DoubleDoor:
                // 双开门：两个矩形拼接
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(0, -halfThickness),
                    new THREE.Vector2(0, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(0, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(0, halfThickness)
                ];
            case OpeningType.MotherChildDoor:
                // 子母门：主门和子门的组合
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(-halfLength / 2, -halfThickness),
                    new THREE.Vector2(-halfLength / 2, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(-halfLength / 2, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(-halfLength / 2, halfThickness)
                ];
            case OpeningType.SlidingDoor:
                // 推拉门：两个矩形拼接
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(0, -halfThickness),
                    new THREE.Vector2(0, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(0, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(0, halfThickness)
                ];
            case OpeningType.BalconyDoor:
                // 阳台门：矩形
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, -halfThickness)
                ];
            case OpeningType.StraightWindow:
                // 平开窗：矩形
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, -halfThickness)
                ];
            case OpeningType.BayWindow:
                // 飘窗：多边形
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(0, -halfThickness),
                    new THREE.Vector2(halfLength, 0),
                    new THREE.Vector2(0, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, -halfThickness)
                ];
            default:
                throw new Error(`Unsupported opening type: ${this.type}`);
        }
    }

    private get3DPoints(): THREE.Vector2[] {
        const halfLength = this.length / 2;
        const halfThickness = this.thickness / 2;  // 使用厚度的一半代替高度的一半

        switch (this.type) {
            case OpeningType.SingleDoor:
                // 单开门：矩形
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness)
                ];
            case OpeningType.DoubleDoor:
                // 双开门：两个矩形拼接
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(0, -halfThickness),
                    new THREE.Vector2(0, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness),
                    new THREE.Vector2(0, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(0, halfThickness)
                ];
            case OpeningType.MotherChildDoor:
                // 子母门：主门和子门的组合
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(-halfLength / 2, -halfThickness),
                    new THREE.Vector2(-halfLength / 2, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness),
                    new THREE.Vector2(-halfLength / 2, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(-halfLength / 2, halfThickness)
                ];
            case OpeningType.SlidingDoor:
                // 推拉门：两个矩形拼接
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(0, -halfThickness),
                    new THREE.Vector2(0, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness),
                    new THREE.Vector2(0, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(0, halfThickness)
                ];
            case OpeningType.BalconyDoor:
                // 阳台门：矩形
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness)
                ];
            case OpeningType.StraightWindow:
                // 平开窗：矩形
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, -halfThickness),
                    new THREE.Vector2(halfLength, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness)
                ];
            case OpeningType.BayWindow:
                // 飘窗：多边形
                return [
                    new THREE.Vector2(-halfLength, -halfThickness),
                    new THREE.Vector2(0, -halfThickness),
                    new THREE.Vector2(halfLength, 0),
                    new THREE.Vector2(0, halfThickness),
                    new THREE.Vector2(-halfLength, halfThickness)
                ];
            default:
                throw new Error(`Unsupported opening type: ${this.type}`);
        }
    }
}