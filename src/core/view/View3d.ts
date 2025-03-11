/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 16:18:43
 * @Description: 
 * @Version: 1.0
 */
import * as THREE from 'three';
import { TrackballControls3D } from './trackball/TrackballControls3D';

export class View3d {
    private divId: string;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    private controls: TrackballControls3D; // 新增：用于控制视图的轨迹球控件

    constructor(divId: string) {
        this.divId = divId;

        // 初始化渲染器
        console.log(`window.innerWidth=${window.innerWidth}, window.innerHeight=${window.innerHeight}`);
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

        // 初始化轨迹球控件
        this.controls = new TrackballControls3D(this.camera, this.renderer.domElement);
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