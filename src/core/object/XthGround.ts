/*
 * @Author: LinYiHan
 * @Date: 2025-03-13 18:11:11
 * @Description: 地面物体类
 * @Version: 1.0
 */
import * as THREE from 'three';
import { ModelingTool } from '../bottomClass/ModelingTool';
import { XthCompositeLine } from './XthCompositeLine';
import { XthObject } from './XthObject';
import { JsonProperty } from '../bottomClass/Decorator';
import { Configure } from '../bottomClass/Configure';

export class XthGround extends XthObject {
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

        // 如果没有传入颜色值，则使用 Configure 中的默认值
        if (!json || json.normalMeshColor2 === undefined) {
            this.normalMeshColor2 = Configure.Instance.groundMeshColor2;
        }
        if (!json || json.normalMeshColor3 === undefined) {
            this.normalMeshColor3 = Configure.Instance.groundMeshColor3;
        }

        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthGround',
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
    public addHhole(hole: XthCompositeLine): void {
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
        const outlinePoints3D = this._outline.getDividedPoints(10);
        const outlinePoints = outlinePoints3D.map(point => new THREE.Vector2(point.x, point.y));
        const holesPoints3D = this._holes.map(hole => hole.getDividedPoints(10));
        const holesPoints = holesPoints3D.map(holePoints => holePoints.map(point => new THREE.Vector2(point.x, point.y)));

        // 使用配置中的地面贴图
        const texture = new THREE.TextureLoader().load(Configure.Instance.groundTexturePath);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

        // 创建二维图形
        const shapeGeometry = ModelingTool.CreateShapeGeometry([outlinePoints, ...holesPoints]);
        ModelingTool.setAutoUV(shapeGeometry, 800, 800);
        const mesh = new THREE.Mesh(shapeGeometry, material);

        selfObject2.add(mesh);
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

        // 使用配置中的地面贴图
        const texture = new THREE.TextureLoader().load(Configure.Instance.groundTexturePath);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const material = new THREE.MeshBasicMaterial({ map: texture });

        // 创建三维图形
        const shapeGeometry = ModelingTool.CreateShapeGeometry([outlinePoints, ...holesPoints]);
        ModelingTool.setAutoUV(shapeGeometry, 800, 800);
        const mesh = new THREE.Mesh(shapeGeometry, material);

        selfObject3.add(mesh);
    }
}