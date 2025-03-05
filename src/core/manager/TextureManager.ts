import * as THREE from 'three';

export class TextureManager {
    private loader: THREE.TextureLoader;
    private textureList: THREE.Texture[];

    constructor() {
        this.loader = new THREE.TextureLoader();
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
        onLoad?: (texture: THREE.Texture) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: any) => void
    ): THREE.Texture {
        const texture = this.loader.load(url, onLoad, onProgress, onError);
        this.textureList.push(texture);
        return texture;
    }
}