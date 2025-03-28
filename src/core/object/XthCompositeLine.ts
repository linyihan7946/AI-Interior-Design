/*
 * @Author: LinYiHan
 * @Date: 2025-03-07 10:27:22
 * @Description: 复合线类，由多段线段组合而成
 * @Version: 1.0
 */
import * as BABYLON from 'babylonjs';
import { XthObject } from './XthObject';
import { JsonProperty } from '../bottomClass/Decorator';
import { XthLine } from './XthLine';
import { ModelingTool } from '../bottomClass/ModelingTool';
import { MaterialNameList } from '../bottomClass/MaterialNameList';

export class XthCompositeLine extends XthObject {
    @JsonProperty()
    private _isClosed: boolean = false; // 是否闭合

    constructor(json?: any) {
        super(json);
        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthCompositeLine',
            writable: false,
            configurable: true
        });
    }

    /**
     * 添加线段
     * @param line 线段实例
     */
    public addLine(line: XthLine): void {
        this.addChild(line);
    }

    /**
     * 获取所有线段集合
     * @returns 返回所有线段集合
     */
    public getLines(): XthLine[] {
        return this.children.filter(child => child instanceof XthLine) as XthLine[];
    }

    /**
     * 获取等分点集
     * @param segments 分段数
     * @returns 返回等分点集
     */
    public getDividedPoints(segments: number): BABYLON.Vector3[] {
        const points: BABYLON.Vector3[] = [];
        const lines = this.getLines();

        for (const line of lines) {
            const linePoints = line.getDividedPoints(segments);
            // 检查并移除与前一个点重复的点
            if (points.length > 0 && linePoints.length > 0) {
                const lastPoint = points[points.length - 1];
                const firstPoint = linePoints[0];
                if (lastPoint.equals(firstPoint)) {
                    linePoints.shift(); // 移除重复的点
                }
            }
            points.push(...linePoints);
        }

        return points;
    }

    /**
     * 设置是否闭合
     * @param isClosed 是否闭合
     */
    public setIsClosed(isClosed: boolean): void {
        this._isClosed = isClosed;
    }

    /**
     * 获取是否闭合
     * @returns 返回是否闭合
     */
    public getIsClosed(): boolean {
        return this._isClosed;
    }

    public build2d(scene2: BABYLON.Scene | undefined): void {
        const selfObject2 = this.getSelfObject2();
        ModelingTool.removeObject3D(selfObject2);

        const points = this.getDividedPoints(10); // 默认分为10段
 
        const line = BABYLON.MeshBuilder.CreateLines("lines", { points });  
        const material = new BABYLON.StandardMaterial(MaterialNameList.LINE_MATERIAL, scene2);
        material.diffuseColor = this.getNormalLineColor2();
        line.material = material;
        line.parent = selfObject2;
    }

    public build3d(scene3: BABYLON.Scene | undefined): void {
        const selfObject3 = this.getSelfObject3();
        ModelingTool.removeObject3D(selfObject3);

        const points = this.getDividedPoints(10); // 默认分为10段

        const line = BABYLON.MeshBuilder.CreateLines("lines", { points });  
        const material = new BABYLON.StandardMaterial(MaterialNameList.LINE_MATERIAL, scene3);
        material.diffuseColor = this.getNormalLineColor3();
        line.material = material;
        line.parent = selfObject3;
    }
}