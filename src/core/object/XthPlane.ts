/*
 * @Author: LinYiHan
 * @Date: 2025-03-13 18:11:11
 * @Description: 
 * @Version: 1.0
 */
import * as BABYLON from 'babylonjs';
import { ModelingTool } from '../bottomClass/ModelingTool';
import { XthCompositeLine } from './XthCompositeLine';
import { XthObject } from './XthObject';
import { JsonProperty } from '../bottomClass/Decorator';

export class XthPlane extends XthObject {
    // 外圈，不用序列化
    @JsonProperty(false)
    private _outline: XthCompositeLine;

    // 内孔，不用序列化
    @JsonProperty(false)
    private _holes: XthCompositeLine[];

    constructor(json?: any) {
        super(json);
        this._outline = json?.outline || new XthCompositeLine();
        this._holes = json?.holes || [];

        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthPlane',
            writable: false,
            configurable: true
        });
    }

    /**
     * 获取外圈
     * @returns 返回外圈
     */
    public getOutline(): XthCompositeLine {
        return this._outline;
    }

    /**
     * 设置外圈
     * @param outline 要设置的外圈
     */
    public setOutline(outline: XthCompositeLine): void {
        this._outline = outline;
    }

    /**
     * 获取内孔
     * @returns 返回内孔数组
     */
    public getHoles(): XthCompositeLine[] {
        return this._holes;
    }

    /**
     * 添加内孔
     * @param hole 要添加的内孔
     */
    public addHole(hole: XthCompositeLine): void {
        this._holes.push(hole);
    }

    /**
     * 移除内孔
     * @param hole 要移除的内孔
     */
    public removeHole(hole: XthCompositeLine): void {
        const index = this._holes.indexOf(hole);
        if (index !== -1) {
            this._holes.splice(index, 1);
        }
    }

    /**
     * 构建二维图形
     */
    public build2d(): void {
        const selfObject2 = this.getSelfObject2();
        ModelingTool.removeObject3D(selfObject2);

        // 获取外圈和内孔的点集
        const outlinePoints = this._outline.getDividedPoints(10);
        const holesPoints = this._holes.map(hole => hole.getDividedPoints(10));

        // 创建二维图形
        const material = new BABYLON.StandardMaterial("lineMat");
        material.diffuseColor = this.getNormalMeshColor2();
        const mesh = ModelingTool.CreateShapeGeometry([outlinePoints, ...holesPoints]);
        mesh.material = material;
        mesh.parent = selfObject2;
    }

    /**
     * 构建三维图形
     */
    public build3d(): void {
        const selfObject3 = this.getSelfObject3();
        ModelingTool.removeObject3D(selfObject3);

        // 获取外圈和内孔的点集
        const outlinePoints = this._outline.getDividedPoints(10);
        const holesPoints = this._holes.map(hole => hole.getDividedPoints(10));

        // 创建三维图形
        const material = new BABYLON.StandardMaterial("lineMat");
        material.diffuseColor = this.getNormalMeshColor3();
        const mesh = ModelingTool.CreateShapeGeometry([outlinePoints, ...holesPoints]);
        mesh.material = material;
        mesh.parent = selfObject3;
    }
}