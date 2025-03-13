/*
 * @Author: LinYiHan
 * @Date: 2025-03-07 10:27:22
 * @Description: 线段类，可以是直线、圆弧或贝塞尔曲线
 * @Version: 1.0
 */
import * as THREE from 'three';
import { XthObject } from './XthObject';
import { JsonProperty } from '../bottomClass/Decorator';
import { ModelingTool } from '../bottomClass/ModelingTool';

export class XthLine extends XthObject {
    @JsonProperty()
    startPt: THREE.Vector3 = new THREE.Vector3(); // 起点

    @JsonProperty()
    endPt: THREE.Vector3 = new THREE.Vector3(); // 终点

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
    }

    /**
     * 获取等分点集
     * @param segments 分段数
     * @returns 返回等分点集
     */
    public getDividedPoints(segments: number): THREE.Vector3[] {
        const points: THREE.Vector3[] = [];
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
                points.push(new THREE.Vector3(x, y, this.startPt.z));
            }
        } else {
            // 直线段的等分点
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const point = new THREE.Vector3().lerpVectors(this.startPt, this.endPt, t);
                points.push(point);
            }
        }
        return points;
    }

    /**
     * 计算圆弧的中心点
     * @returns 圆弧的中心点
     */
    private calculateArcCenter(): THREE.Vector3 {
        const midPoint = new THREE.Vector3().addVectors(this.startPt, this.endPt).multiplyScalar(0.5);
        const chordLength = this.startPt.distanceTo(this.endPt);
        const height = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(chordLength / 2, 2));
        const direction = new THREE.Vector3().subVectors(this.endPt, this.startPt).normalize();
        const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
        return midPoint.clone().add(perpendicular.multiplyScalar(height));
    }

    /**
     * 计算圆弧的起始角度
     * @param center 圆弧的中心点
     * @returns 起始角度
     */
    private calculateArcStartAngle(center: THREE.Vector3): number {
        const startVector = new THREE.Vector3().subVectors(this.startPt, center);
        return Math.atan2(startVector.y, startVector.x);
    }

    /**
     * 计算圆弧的结束角度
     * @param center 圆弧的中心点
     * @returns 结束角度
     */
    private calculateArcEndAngle(center: THREE.Vector3): number {
        const endVector = new THREE.Vector3().subVectors(this.endPt, center);
        return Math.atan2(endVector.y, endVector.x);
    }

    /**
     * 构建二维图形
     */
    public build2d(): void {
        const selfObject2 = this.getSelfObject2();
        ModelingTool.removeObject3D(selfObject2);

        const points = this.getDividedPoints(10); // 默认分为10段
        const material = new THREE.LineBasicMaterial({ color: this.getNormalLineColor2() });

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        selfObject2.add(line);
    }

    /**
     * 构建三维图形
     */
    public build3d(): void {
        const selfObject3 = this.getSelfObject3();
        ModelingTool.removeObject3D(selfObject3);

        const points = this.getDividedPoints(10); // 默认分为10段
        const material = new THREE.LineBasicMaterial({ color: this.getNormalLineColor3() });

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        selfObject3.add(line);
    }
}