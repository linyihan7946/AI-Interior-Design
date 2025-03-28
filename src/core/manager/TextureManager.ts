/*
 * @Author: LinYiHan
 * @Date: 2025-03-05 18:07:57
 * @Description: 
 * @Version: 1.0
 */
import * as BABYLON from 'babylonjs';

export class TextureManager {
    private textureList: BABYLON.Texture[];

    constructor() {
        this.textureList = [];
    }

    /**
     * 加载贴图
     * @param url 贴图路径
     * @param onLoad 加载完成回调
     * @param onProgress 加载进度回调
     * @param onError 加载错误回调
     * @returns 加载的贴图
     */
    public load(
        url: string,
        onLoad?: (texture: BABYLON.Texture) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: any) => void
    ): BABYLON.Texture {
        const texture = new BABYLON.Texture(url);
        this.textureList.push(texture);
        return texture;
    }
}