/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 16:18:43
 * @Description: 
 * @Version: 1.0
 */
import * as THREE from 'three';

export class View3d {
    // 容器窗口id
    private divId: string;

    // 渲染器
    public renderer: THREE.WebGLRenderer;

    // 场景
    public scene: THREE.Scene;

    // 相机
    public camera: THREE.PerspectiveCamera;

    /**
     * 构造函数
     * @param divId 容器窗口id
     */
    constructor(divId: string) {
        this.divId = divId;

        // 初始化渲染器
        console.log(`window.innerWidth=${window.innerWidth}, window.innerHeight=${window.innerHeight}`)
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById(this.divId)?.appendChild(this.renderer.domElement);

        // 初始化场景
        this.scene = new THREE.Scene();

        // 初始化相机
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1.0E7);
        this.camera.position.set(500, -2000, 1300); // 设置相机位置
        this.camera.up.set(0, 0, 1); // 设置相机的 up 向量
        this.camera.lookAt(0, 1, 0); // 设置相机朝向
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