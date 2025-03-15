/*
 * @Author: LinYiHan
 * @Date: 2025-03-07 10:27:22
 * @Description: 复合线类，由多段线段组合而成
 * @Version: 1.0
 */
import * as THREE from 'three';
import { XthObject } from './XthObject';
import { JsonProperty } from '../bottomClass/Decorator';
import { XthLine } from './XthLine';
import { ModelingTool } from '../bottomClass/ModelingTool';

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
     * 添加点，并自动生成线段
     * @param point 要添加的点
     */
    public addPoint(point: THREE.Vector3): void {
        const lines = this.getLines();
        if (lines.length > 0) {
            const lastLine = lines[lines.length - 1];
            const newLine = new XthLine();
            newLine.startPt = lastLine.endPt.clone();
            newLine.endPt = point.clone();
            this.addLine(newLine);
        } else {
            const newLine = new XthLine();
            newLine.startPt = point.clone();
            newLine.endPt = point.clone();
            this.addLine(newLine);
        }
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
    public getDividedPoints(segments: number): THREE.Vector3[] {
        const points: THREE.Vector3[] = [];
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