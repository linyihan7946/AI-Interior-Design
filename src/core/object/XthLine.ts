/*
 * @Author: LinYiHan
 * @Date: 2025-03-07 10:27:22
 * @Description: 线段类，可以是直线、圆弧或贝塞尔曲线
 * @Version: 1.0
 */
import * as BABYLON from 'babylonjs';
import { XthObject } from './XthObject';
import { JsonProperty } from '../bottomClass/Decorator';
import { ModelingTool } from '../bottomClass/ModelingTool';
import { MaterialNameList } from '../bottomClass/MaterialNameList';

export class XthLine extends XthObject {
    @JsonProperty()
    startPt: BABYLON.Vector3 = new BABYLON.Vector3(); // 起点

    @JsonProperty()
    endPt: BABYLON.Vector3 = new BABYLON.Vector3(); // 终点

    @JsonProperty()
    radius: number = 0; // 圆弧半径

    @JsonProperty()
    isArc: boolean = false; // 是否为圆弧

    constructor(json?: any) {
        super(json);
        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthLine',
            writable: false,
            configurable: true
        });
        this.fromJSON(json);
    }

    /**
     * 获取等分点集
     * @param segments 分段数
     * @returns 返回等分点集
     */
    public getDividedPoints(segments: number): BABYLON.Vector3[] {
        const points: BABYLON.Vector3[] = [];
        if (this.isArc && this.radius > 0) {
            // 计算圆弧的等分点
            const center = this.calculateArcCenter();
            const startAngle = this.calculateArcStartAngle(center);
            const endAngle = this.calculateArcEndAngle(center);
            const angleStep = (endAngle - startAngle) / segments;
            for (let i = 0; i <= segments; i++) {
                const angle = startAngle + angleStep * i;
                const x = center.x + this.radius * Math.cos(angle);
                const y = center.y + this.radius * Math.sin(angle);
                points.push(new BABYLON.Vector3(x, y, this.startPt.z));
            }
        } else {
            points.push(this.startPt);
            points.push(this.endPt);
            // 直线段的等分点
            // for (let i = 0; i <= segments; i++) {
            //     const t = i / segments;
            //     const point = BABYLON.Vector3.Lerp(this.startPt, this.endPt, t);
            //     points.push(point);
            // }
        }
        return points;
    }

    /**
     * 计算圆弧的中心点
     * @returns 圆弧的中心点
     */
    private calculateArcCenter(): BABYLON.Vector3 {
        const midPoint = this.startPt.add(this.endPt).multiplyByFloats(0.5, 0.5, 0.5);
        const chordLength = this.startPt.subtract(this.endPt).length();
        const height = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(chordLength / 2, 2));
        const direction = this.endPt.subtract(this.startPt).normalize();
        const perpendicular = new BABYLON.Vector3(-direction.y, direction.x, 0).normalize();
        return midPoint.clone().add(perpendicular.multiplyByFloats(height, height, height));
    }

    /**
     * 计算圆弧的起始角度
     * @param center 圆弧的中心点
     * @returns 起始角度
     */
    private calculateArcStartAngle(center: BABYLON.Vector3): number {
        const startVector = this.startPt.subtract(center);
        return Math.atan2(startVector.y, startVector.x);
    }

    /**
     * 计算圆弧的结束角度
     * @param center 圆弧的中心点
     * @returns 结束角度
     */
    private calculateArcEndAngle(center: BABYLON.Vector3): number {
        const endVector = this.endPt.subtract(center);
        return Math.atan2(endVector.y, endVector.x);
    }

    public build2d(scene2: BABYLON.Scene | undefined): void {
        const selfObject2 = this.getSelfObject2();
        ModelingTool.removeObject3D(selfObject2);

        const points = this.getDividedPoints(10); // 默认分为10段
        const material = new BABYLON.StandardMaterial(MaterialNameList.LINE_MATERIAL, scene2);
        material.diffuseColor = this.getNormalLineColor2();
        const line = BABYLON.MeshBuilder.CreateLines("lines", { points, updatable: true });
        line.material = material;
        line.parent = selfObject2;
    }

    public build3d(scene3: BABYLON.Scene | undefined): void {
        const selfObject3 = this.getSelfObject3();
        ModelingTool.removeObject3D(selfObject3);

        const points = this.getDividedPoints(10); // 默认分为10段
        const material = new BABYLON.StandardMaterial(MaterialNameList.LINE_MATERIAL, scene3);
        material.diffuseColor = this.getNormalLineColor3();

        const line = BABYLON.MeshBuilder.CreateLines("lines", { points, updatable: true });
        line.material = material;
        line.parent = selfObject3;
    }
}