/*
 * @Author: LinYiHan
 * @Date: 2025-03-13 18:11:11
 * @Description: 地面物体类
 * @Version: 1.0
 */
import * as BABYLON from 'babylonjs';

import { MaterialNameList } from '../bottomClass/MaterialNameList';
import { ModelingTool } from '../bottomClass/ModelingTool';
import { XthCompositeLine } from './XthCompositeLine';
import { XthObject } from './XthObject';
import { JsonProperty } from '../bottomClass/Decorator';
import { Configure } from '../bottomClass/Configure';
import { Geometry } from '../bottomClass/Geometry';

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
            ModelingTool.setColor(this.normalMeshColor2, Configure.Instance.groundMeshColor2)
        }
        if (!json || json.normalMeshColor3 === undefined) {
            ModelingTool.setColor(this.normalMeshColor3, Configure.Instance.groundMeshColor3)
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
    build2d(scene2: BABYLON.Scene | undefined): void {
        if (!scene2) {
            console.warn('Scene is undefined in build2d');
            return;
        }

        const selfObject2 = this.getSelfObject2();
        ModelingTool.removeObject3D(selfObject2);

        // 获取外圈和内孔的点集
        const outlinePoints3D = this._outline.getDividedPoints(10);
        const holesPoints3D = this._holes.map(hole => hole.getDividedPoints(10));
       
        // 使用配置中的地面贴图
        const texture = new BABYLON.Texture(Configure.Instance.groundTexturePath, scene2);
        const material = new BABYLON.StandardMaterial(MaterialNameList.GROUND_MATERIAL, scene2);
        material.diffuseTexture = texture;
        material.emissiveTexture = texture;
        material.disableLighting = true;
        material.backFaceCulling = false;

        // 创建二维图形
        const mesh = ModelingTool.CreateShapeGeometry([outlinePoints3D, ...holesPoints3D], scene2);
        mesh.material = material;
        mesh.parent = selfObject2;
    }

    /**
     * 构建三维图形
     */
    build3d(scene3: BABYLON.Scene | undefined): void {
        if (!scene3) {
            console.warn('Scene is undefined in build3d');
            return;
        }
        const selfObject3 = this.getSelfObject3();
        ModelingTool.removeObject3D(selfObject3);

        // 获取外圈和内孔的点集
        const outlinePoints = this._outline.getDividedPoints(10);
        const holesPoints = this._holes.map(hole => hole.getDividedPoints(10));

        // 使用配置中的地面贴图
        const texture = new BABYLON.Texture(Configure.Instance.groundTexturePath, scene3);
        const material = new BABYLON.StandardMaterial(MaterialNameList.GROUND_MATERIAL, scene3);
        material.diffuseTexture = texture;
        material.emissiveTexture = texture;
        material.disableLighting = true;
        material.backFaceCulling = false;

        // 创建三维图形
        const mesh = ModelingTool.CreateShapeGeometry([outlinePoints, ...holesPoints], scene3);
        mesh.material = material;
        mesh.parent = selfObject3;
    }
}