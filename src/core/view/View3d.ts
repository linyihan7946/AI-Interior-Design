/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 16:18:43
 * @Description: 
 * @Version: 1.0
 */
import * as BABYLON from '@babylonjs/core';
import { TemporaryVariable } from '../bottomClass/TemporaryVariable';
import { Configure } from '../bottomClass/Configure';

export class View3d {
    private divId: string;
    public engine: BABYLON.Engine;
    public camera: BABYLON.ArcRotateCamera | null = null;
    public scene: BABYLON.Scene | undefined = undefined;
    private container: HTMLCanvasElement | null;

    constructor(divId: string) {
        this.divId = divId;
        this.container = document.getElementById(this.divId) as HTMLCanvasElement | null;

        if (!this.container) {
            throw new Error(`Element with id ${divId} not found`);
        }

        // 初始化引擎
        this.engine = new BABYLON.Engine(this.container, true);

        // 初始化场景
        TemporaryVariable.scene3d = new BABYLON.Scene(this.engine);
        console.log('TemporaryVariable.scene3d initialized:', TemporaryVariable.scene3d);
        this.scene = TemporaryVariable.scene3d;
        TemporaryVariable.scene3d.preventDefaultOnPointerDown = false;
        TemporaryVariable.scene3d.preventDefaultOnPointerUp = false;

        // 初始化相机
        this.camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(2000, 1400, 6000), TemporaryVariable.scene3d);
        this.camera.attachControl(this.container, true); // 允许事件冒泡
        this.camera.setTarget(new BABYLON.Vector3(2000, 1400, -100));

        // 设置相机控制
        this.camera.wheelPrecision = 50; // 设置滚轮灵敏度
        this.camera.panningSensibility = 1000; // 设置平移灵敏度
        this.camera.zoomOnFactor = 3.0; // 增加缩放因子
        this.camera.zoomToMouseLocation = true; // 设置缩放时以鼠标位置为中心

        // 添加环境光
        const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), TemporaryVariable.scene3d);
        ambientLight.intensity = 0.7;

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        // 设置场景背景色
        const bgColor = Configure.Instance.backgroundColor3;
        TemporaryVariable.scene3d.clearColor = new BABYLON.Color4(
            ((bgColor >> 16) & 0xff) / 255,
            ((bgColor >> 8) & 0xff) / 255,
            (bgColor & 0xff) / 255,
            1
        );

        // 启用阴影
        TemporaryVariable.scene3d.shadowsEnabled = true;

        this.engine.runRenderLoop(() => {
            if (!TemporaryVariable.scene3d) {
                return;
            }    
            TemporaryVariable.scene3d.render(); 
        });
    }

    public render(): void {
        if (TemporaryVariable.scene3d) {
            TemporaryVariable.scene3d.render();
        }
    }
}