/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 16:18:43
 * @Description: 
 * @Version: 1.0
 */
import * as THREE from 'three';
import { TrackballControls3D } from './trackball/TrackballControls3D';
import { Configure } from '../bottomClass/Configure';

export class View3d {
    private divId: string;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    private controls: TrackballControls3D;
    private container: HTMLElement | null;

    constructor(divId: string) {
        this.divId = divId;
        this.container = document.getElementById(this.divId);

        if (!this.container) {
            throw new Error(`Element with id ${divId} not found`);
        }

        // 初始化渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0xf0f0f0); // 设置背景色为浅灰色
        this.container.appendChild(this.renderer.domElement);

        // 初始化场景
        this.scene = new THREE.Scene();

        // 初始化相机
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1.0E7);
        this.camera.position.set(500, -2000, 1300); // 设置相机位置
        this.camera.up.set(0, 0, 1); // 设置相机的 up 向量
        this.camera.lookAt(0, 1, 0); // 设置相机朝向

        // 添加网格线
        const gridSize = 1.0E5; // 网格尺寸改为 1.0E5
        const gridHelper = new THREE.GridHelper(gridSize, Configure.Instance.gridDivisions3, Configure.Instance.gridLineColor3, Configure.Instance.gridLineColor3);
        gridHelper.position.set(0, 0, 0);
        gridHelper.rotation.x = Math.PI / 2; // 沿x轴旋转90度
        this.scene.add(gridHelper);

        // 初始化轨迹球控件
        this.controls = new TrackballControls3D(this.camera, this.renderer.domElement);

        // 监听窗口大小变化
        window.addEventListener('resize', this.resize.bind(this));
    }

    /**
     * 调整渲染器大小以匹配容器大小
     */
    private resize(): void {
        if (this.container) {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
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