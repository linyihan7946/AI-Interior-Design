import { XthScene } from '../object/XthScene';

export class SceneManager {
    private scene?: XthScene;

    constructor() {
    }

    /**
     * 设置当前场景
     * @param scene 要设置的场景
     */
    public setScene(scene: XthScene): void {
        this.scene = scene;
    }

    /**
     * 获取当前场景
     * @returns 当前场景
     */
    public getScene(): XthScene | undefined {
        return this.scene;
    }

    /**
     * 加载场景
     * @param json 场景数据
     * @returns 加载后的场景
     */
    public load(json: any): XthScene | undefined {
        if (!this.scene) {
            console.warn('Scene is not initialized');
            return undefined;
        }
        this.scene.fromJSON(json);
        return this.scene;
    }

    /**
     * 保存场景
     * @param param 保存参数
     * @returns 保存后的数据
     */
    public save(param: any): any {
        if (!this.scene) {
            console.warn('Scene is not initialized');
            return undefined;
        }
        return this.scene.toJSON();
    }

    /**
     * 保存场景到本地
     * @param param 保存参数
     * @returns 保存后的数据
     */
    public saveLocal(param: any): any {
        const data = this.save(param);
        if (!data) {
            return undefined;
        }
        // 这里可以添加将数据保存到本地的逻辑，例如使用 localStorage 或文件系统
        return data;
    }
}