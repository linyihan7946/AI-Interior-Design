/*
 * @Author: LinYiHan
 * @Date: 2025-03-07 10:27:22
 * @Description: 
 * @Version: 1.0
 */
import * as THREE from 'three';

export class View2d {
    private divId: string;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public camera: THREE.OrthographicCamera;

    /**
     * 构造函数
     * @param divId 容器窗口的ID
     */
    constructor(divId: string) {
        this.divId = divId;
        const container = document.getElementById(this.divId);

        if (!container) {
            throw new Error(`Element with id ${divId} not found`);
        }

        // 初始化渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor(0xf0f0f0); // 设置背景色为浅灰色
        container.appendChild(this.renderer.domElement);

        // 初始化场景
        this.scene = new THREE.Scene();

        // 初始化正交相机
        const aspect = container.clientWidth / container.clientHeight;
        const scale = 2000; // 设置缩放比例为 2000
        this.camera = new THREE.OrthographicCamera(-aspect * scale, aspect * scale, 1 * scale, -1 * scale, 0.0001, 1000000); // 将 near 和 far 分别修改为 0.0001 和 1000000
        this.camera.position.set(0, 0, 500); // 设置相机位置
        this.camera.lookAt(0, 0, 0); // 设置相机朝向
        this.camera.zoom = 1; // 设置相机 zoom 值为 1

        // 添加黑色网格线
        const gridSize = 1000000; // 网格尺寸放大到 1000000
        const gridDivisions = 1000; // 等分设置为 1000
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x000000, 0x000000);
        gridHelper.position.set(0, 0, 0);
        gridHelper.rotation.x = Math.PI / 2; // 沿x轴旋转90度
        this.scene.add(gridHelper);
    }

    /**
     * 渲染场景
     */
    public render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 添加物体到场景中
     * @param object 要添加的物体
     */
    public addObject(object: THREE.Object3D): void {
        this.scene.add(object);
    }

    /**
     * 从场景中移除物体
     * @param object 要移除的物体
     */
    public removeObject(object: THREE.Object3D): void {
        this.scene.remove(object);
    }
}