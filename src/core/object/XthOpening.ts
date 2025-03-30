/*
 * @Author: LinYiHan
 * @Date: 2025-03-04 16:36:28
 * @Description: 
 * @Version: 1.0
 */
import { XthObject } from './XthObject';
import { JsonProperty } from '../bottomClass/Decorator';
import { ModelingTool } from '../bottomClass/ModelingTool';
import { Configure } from '../bottomClass/Configure';
import { XthWall } from './XthWall';
import { Geometry } from '../bottomClass/Geometry';
import * as BABYLON from '@babylonjs/core';
import { OpeningType } from '../enum/OpeningType';
import { TemporaryVariable } from '../bottomClass/TemporaryVariable';

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
        this.fromJSON(json);
    }

    build2d(scene2?: BABYLON.Scene): void {
        const selfObject2 = this.getSelfObject2();
        ModelingTool.removeObject3D(selfObject2);

        const points = this.get2DPoints();
        const material = new BABYLON.StandardMaterial("material", scene2);
        material.diffuseColor = this.getNormalMeshColor2();
        material.emissiveColor = this.getNormalMeshColor2();
        material.disableLighting = true;
        const planeShape = ModelingTool.CreateShapeGeometry([points], scene2);
        const matrix = BABYLON.Matrix.Translation(0, 0, 10);
        ModelingTool.applyMatrix4(planeShape, matrix);
        planeShape.material = material;
        planeShape.parent = selfObject2;
    }

    build3d(scene3?: BABYLON.Scene): void {
        if (!TemporaryVariable.scene3d) {
            return;
        }
        const selfObject3 = this.getSelfObject3();
        ModelingTool.removeObject3D(selfObject3);

        const gltfPath = Configure.Instance.gltfPaths[this.type];
        if (gltfPath) {
            ModelingTool.loadGLTF(gltfPath, TemporaryVariable.scene3d).then((model) => {
                if (!model) {
                    return;
                }
                // 获取模型的边界框
                
                const boundingInfo = ModelingTool.getHierarchyBoundingBox(model);
                if (!boundingInfo) {
                    return;
                }

                const size = boundingInfo.maximum.subtract(boundingInfo.minimum);

                // 根据模型的默认尺寸和门窗的实际尺寸计算缩放比例
                const scale = new BABYLON.Vector3(
                    this.length / size.x, // 根据实际长度和模型默认长度进行缩放
                    this.thickness / size.y, // 根据实际高度和模型默认高度进行缩放
                    this.height / size.z // 根据实际厚度和模型默认厚度进行缩放
                );
                model.scaling = scale; // 应用缩放比例
                selfObject3.addChild(model);
            }).catch((error) => {
                console.error('Failed to load GLTF model:', error);
                // 如果加载失败，使用默认的拉伸造型
                const points = this.get3DPoints();
                const height = this.height;
                const material = new BABYLON.StandardMaterial("material", scene3);
                material.diffuseColor = this.getNormalMeshColor3();
                material.emissiveColor = this.getNormalMeshColor3();
                material.disableLighting = true;
                const extrudedShape = ModelingTool.createExtrudedShape(points, height, material, scene3);
                selfObject3.addChild(extrudedShape);
            });
        } else {
            // 如果没有配置 GLTF 路径，使用默认的拉伸造型
            const points = this.get3DPoints();
            const height = this.height;
            const material = new BABYLON.StandardMaterial("material", scene3);
            material.diffuseColor = this.getNormalMeshColor3();
            material.emissiveColor = this.getNormalMeshColor3();
            material.disableLighting = true;
            const extrudedShape = ModelingTool.createExtrudedShape(points, height, material, scene3);
            selfObject3.addChild(extrudedShape);
        }
    }

    /**
     * 停靠到指定墙体
     * @param wall 要停靠的墙体
     */
    public dockToWall(wall: XthWall): void {
        // 计算墙体的方向向量
        const wallDirection = wall.endPoint.subtract(wall.startPoint).normalize();

        // 计算门窗的中心点
        
        const doorCenter = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, 0), this.matrix3);

        // 使用 Geometry.projectPointToLine 计算投影点
        const projectedPoint = Geometry.projectPointToLine(doorCenter, {
            start: wall.startPoint,
            end: wall.endPoint
        }).subtract(wall.startPoint.add(wall.endPoint).multiplyByFloats(0.5, 0.5, 0.5));

        // 计算门窗的旋转角度以适配墙体的方向
        const angle = Math.atan2(wallDirection.y, wallDirection.x);

        // 设置门窗的位置和旋转
        const matrix = this.matrix3.clone().invert().multiply(BABYLON.Matrix.RotationZ(-angle)).multiply(BABYLON.Matrix.Translation(projectedPoint.x, projectedPoint.y, projectedPoint.z));
        this.applyMatrix4(matrix);
    }

    private get2DPoints(): BABYLON.Vector2[] {
        const halfLength = this.length / 2;
        const halfThickness = this.thickness / 2;  // 使用厚度的一半代替高度的一半

        switch (this.type) {
            case OpeningType.SingleDoor:
                // 单开门：矩形
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, -halfThickness)
                ];
            case OpeningType.DoubleDoor:
                // 双开门：两个矩形拼接
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(0, -halfThickness),
                    new BABYLON.Vector2(0, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(0, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(0, halfThickness)
                ];
            case OpeningType.MotherChildDoor:
                // 子母门：主门和子门的组合
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(-halfLength / 2, -halfThickness),
                    new BABYLON.Vector2(-halfLength / 2, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(-halfLength / 2, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength / 2, halfThickness)
                ];
            case OpeningType.SlidingDoor:
                // 推拉门：两个矩形拼接
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(0, -halfThickness),
                    new BABYLON.Vector2(0, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(0, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(0, halfThickness)
                ];
            case OpeningType.BalconyDoor:
                // 阳台门：矩形
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, -halfThickness)
                ];
            case OpeningType.StraightWindow:
                // 平开窗：矩形
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, -halfThickness)
                ];
            case OpeningType.BayWindow:
                // 飘窗：多边形
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(0, -halfThickness),
                    new BABYLON.Vector2(halfLength, 0),
                    new BABYLON.Vector2(0, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, -halfThickness)
                ];
            default:
                throw new Error(`Unsupported opening type: ${this.type}`);
        }
    }

    private get3DPoints(): BABYLON.Vector2[] {
        const halfLength = this.length / 2;
        const halfThickness = this.thickness / 2;  // 使用厚度的一半代替高度的一半

        switch (this.type) {
            case OpeningType.SingleDoor:
                // 单开门：矩形
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness)
                ];
            case OpeningType.DoubleDoor:
                // 双开门：两个矩形拼接
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(0, -halfThickness),
                    new BABYLON.Vector2(0, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness),
                    new BABYLON.Vector2(0, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(0, halfThickness)
                ];
            case OpeningType.MotherChildDoor:
                // 子母门：主门和子门的组合
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(-halfLength / 2, -halfThickness),
                    new BABYLON.Vector2(-halfLength / 2, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength / 2, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength / 2, halfThickness)
                ];
            case OpeningType.SlidingDoor:
                // 推拉门：两个矩形拼接
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(0, -halfThickness),
                    new BABYLON.Vector2(0, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness),
                    new BABYLON.Vector2(0, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(0, halfThickness)
                ];
            case OpeningType.BalconyDoor:
                // 阳台门：矩形
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness)
                ];
            case OpeningType.StraightWindow:
                // 平开窗：矩形
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, -halfThickness),
                    new BABYLON.Vector2(halfLength, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness)
                ];
            case OpeningType.BayWindow:
                // 飘窗：多边形
                return [
                    new BABYLON.Vector2(-halfLength, -halfThickness),
                    new BABYLON.Vector2(0, -halfThickness),
                    new BABYLON.Vector2(halfLength, 0),
                    new BABYLON.Vector2(0, halfThickness),
                    new BABYLON.Vector2(-halfLength, halfThickness)
                ];
            default:
                throw new Error(`Unsupported opening type: ${this.type}`);
        }
    }
}