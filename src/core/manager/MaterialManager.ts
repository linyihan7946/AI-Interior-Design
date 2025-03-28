import { MaterialNameList } from '../bottomClass/MaterialNameList';
import * as BABYLON from 'babylonjs';

export class MaterialManager {
    private materialList: BABYLON.Material[] = [];

    /**
     * 创建材质
     * @param param 材质参数
     * @returns 创建的材质
     */
    public createMaterial(param: any): BABYLON.Material {
        const material = new BABYLON.StandardMaterial(MaterialNameList.DEFAULT_MATERIAL, this.scene);
        // 设置材质参数
        return material;
    }

    /**
     * 获取材质列表
     * @returns 材质列表
     */
    public getMaterialList(): BABYLON.Material[] {
        return this.materialList;
    }
}