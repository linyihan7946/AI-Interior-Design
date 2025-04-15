/*
 * @Author: LinYiHan
 * @Date: 2025-03-04 15:57:08
 * @Description: 家具类
 * @Version: 1.0
 */
import * as BABYLON from '@babylonjs/core';
import { JsonProperty } from "../bottomClass/Decorator";
import { XthObject } from "./XthObject";
import { ModelingTool } from '../bottomClass/ModelingTool';
import { MaterialNameList } from '../bottomClass/MaterialNameList';

interface FurnitureInfo {
    dbId: string;
    name: string;
    gltfUrl: string;
}

export class XthFurniture extends XthObject {
    @JsonProperty()
    private furnitureInfo: FurnitureInfo = {
        dbId: '',
        name: '',
        gltfUrl: ''
    };

    constructor(json?: any) {
        super(json);
        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthFurniture',
            writable: false,
            configurable: true
        });

        if (json && json.furnitureInfo) {
            this.furnitureInfo = json.furnitureInfo;
        }
    }

    /**
     * 获取家具信息
     */
    public getFurnitureInfo(): FurnitureInfo {
        return this.furnitureInfo;
    }

    /**
     * 设置家具信息
     * @param info 家具信息
     */
    public setFurnitureInfo(info: FurnitureInfo): void {
        this.furnitureInfo = info;
    }

    /**
     * 二维建模
     */
    public build2d(scene2: BABYLON.Scene | undefined): void {
        const selfObject2 = this.getSelfObject2();
        ModelingTool.removeObject3D(selfObject2);

        // 创建二维图形
        const material = new BABYLON.StandardMaterial(MaterialNameList.FURNITURE_MATERIAL, scene2);
        material.diffuseColor = this.getNormalMeshColor2();
        const mesh = ModelingTool.CreateShapeGeometry([], scene2);
        mesh.material = material;
        mesh.parent = selfObject2;
    }

    /**
     * 三维建模
     */
    public build3d(scene3: BABYLON.Scene | undefined): void {
        const selfObject3 = this.getSelfObject3();
        ModelingTool.removeObject3D(selfObject3);

        // 加载GLTF模型
        if (this.furnitureInfo.gltfUrl && scene3) {
            ModelingTool.loadGLTF(this.furnitureInfo.gltfUrl, scene3).then((model) => {
                if (model) {
                    model.parent = selfObject3;
                }
            });
        }
    }
}
