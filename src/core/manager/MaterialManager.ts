import * as THREE from 'three';

export class MaterialManager {
    private materialList: THREE.Material[] = [];

    /**
     * 创建材质
     * @param param 材质参数
     * @returns 创建的材质
     */
    public createMaterial(param: any): THREE.Material {
        const material = new THREE.MeshStandardMaterial(param);
        this.materialList.push(material);
        return material;
    }

    /**
     * 获取材质列表
     * @returns 材质列表
     */
    public getMaterialList(): THREE.Material[] {
        return this.materialList;
    }
}