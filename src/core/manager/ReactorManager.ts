/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 14:17:22
 * @Description: 反应器管理类，用于管理所有反应器的注册和执行
 * @Version: 1.0
 */
import { Reactor } from '../bottomClass/Reactor';
import { ReactorNameList } from '../bottomClass/ReactorNameList';

export class ReactorManager {

    constructor() {
    }

    /**
     * 注册所有内核的反应器
     */
    public registryAll(): void {
        this.registryBeforeOpenScene();
        this.registryAfterOpenScene();
        this.registryAfterObject3DChanged();
        this.registryAfterMaterialChanged();
        this.registryAfterTextureChanged();
    }

    /**
     * 注册场景打开前的反应器
     */
    private registryBeforeOpenScene(): void {
        Reactor.registry(ReactorNameList.BEFORE_OPEN_SCENE, () => {});
    }

    /**
     * 注册场景打开后的反应器
     */
    private registryAfterOpenScene(): void {
        Reactor.registry(ReactorNameList.AFTER_OPEN_SCENE, () => {});
    }

    /**
     * 注册3D对象变化后的反应器
     */
    private registryAfterObject3DChanged(): void {
        Reactor.registry(ReactorNameList.AFTER_OBJECT3D_CHANGED, () => {});
    }

    /**
     * 注册材质变化后的反应器
     */
    private registryAfterMaterialChanged(): void {
        Reactor.registry(ReactorNameList.AFTER_MATERIAL_CHANGED, () => {});
    }

    /**
     * 注册纹理变化后的反应器
     */
    private registryAfterTextureChanged(): void {
        Reactor.registry(ReactorNameList.AFTER_TEXTURE_CHANGED, () => {});
    }
}
