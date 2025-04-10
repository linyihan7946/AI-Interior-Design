/*
 * @Author: LinYiHan
 * @Date: 2025-03-07 10:27:22
 * @Description: 
 * @Version: 1.0
 */
import * as BABYLON from '@babylonjs/core';
import { TemporaryVariable } from '../bottomClass/TemporaryVariable';
import { Configure } from '../bottomClass/Configure';
import { ModelingTool } from '../bottomClass/ModelingTool';

export class View2d {
    private divId: string;
    public engine: BABYLON.Engine;
    public camera: BABYLON.UniversalCamera;
    public scene: BABYLON.Scene;
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
        this.scene = new BABYLON.Scene(this.engine);
        TemporaryVariable.scene2d = this.scene;
        TemporaryVariable.scene2d.preventDefaultOnPointerDown = false;
        TemporaryVariable.scene2d.preventDefaultOnPointerUp = false;

        // 设置场景背景色
        const bgColor = Configure.Instance.backgroundColor2;
        this.scene.clearColor = new BABYLON.Color4(
            ((bgColor >> 16) & 0xff) / 255,
            ((bgColor >> 8) & 0xff) / 255,
            (bgColor & 0xff) / 255,
            1
        );

        // 初始化相机
        this.camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 0, 900), TemporaryVariable.scene2d);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.container, true);

        // 设置正交相机模式
        this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this.camera.minZ = -1000;
        this.camera.maxZ = 10000;
        this.camera.rotation = new BABYLON.Vector3(0, 0, 0);
        this.camera.rotation.x = 0;
        this.camera.rotation.y = 0;
        this.camera.rotation.z = 0;
        
        // 更新相机视图范围
        this.updateCameraViewRange();

        this.addCameraControl();

        // 添加平行光
        const directionalLight = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(-1, -1, 1).normalize(), this.scene);
        directionalLight.diffuse = new BABYLON.Color3(1, 1, 1);
        directionalLight.intensity = 0.5;

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.engine.resize();
            this.updateCameraViewRange();
        });

        this.engine.runRenderLoop(() => {
            if (TemporaryVariable.scene2d) {
                this.camera.update();
                TemporaryVariable.scene2d.render();
            }
        });
    }


    private addCameraControl(): void {
        // 定义拖拽状态变量
        let isDragging = false;
        let startX: number, startY: number;
        const scene = this.scene;
        const camera = this.camera;

        camera.inputs.clear(); // 清除所有默认输入

        // 添加事件监听
        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    isDragging = true;
                    startX = scene.pointerX;
                    startY = scene.pointerY;
                    break;
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    if (isDragging && camera.orthoRight && camera.orthoLeft && camera.orthoTop && camera.orthoBottom) {
                        // 计算屏幕坐标差值
                        const deltaX = scene.pointerX - startX;
                        const deltaY = scene.pointerY - startY;
                        
                        // 计算世界坐标中的位移
                        const worldDelta = new BABYLON.Vector3(
                            deltaX * (camera.orthoRight - camera.orthoLeft) / scene.getEngine().getRenderWidth(),
                            -deltaY * (camera.orthoTop - camera.orthoBottom) / scene.getEngine().getRenderHeight(),
                            0
                        );
                        
                        // 更新相机位置
                        camera.position.subtractInPlace(worldDelta);
                        
                        // 重置起始点
                        startX = scene.pointerX;
                        startY = scene.pointerY;
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    isDragging = false;
                    break;
            }
        });

        scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERWHEEL && camera.orthoLeft && camera.orthoRight && camera.orthoTop && camera.orthoBottom) {
                const event = pointerInfo.event as WheelEvent;
                const zoomSpeed = 0.1;
                const delta = (event as any).wheelDelta / 120; // 滚轮方向（向上为正，向下为负）
                
                // 获取鼠标在世界空间中的位置
                const mouseX = scene.pointerX;
                const mouseY = scene.pointerY;
                
                // 将鼠标屏幕坐标转换为世界坐标
                const worldX = camera.orthoLeft + (mouseX / scene.getEngine().getRenderWidth()) * (camera.orthoRight - camera.orthoLeft);
                const worldY = camera.orthoTop - (mouseY / scene.getEngine().getRenderHeight()) * (camera.orthoTop - camera.orthoBottom);
                
                // 计算缩放因子
                const zoomFactor = 1 - delta * zoomSpeed;
                
                // 计算新的视口范围
                const newLeft = worldX - (worldX - camera.orthoLeft) * zoomFactor;
                const newRight = worldX + (camera.orthoRight - worldX) * zoomFactor;
                const newTop = worldY + (camera.orthoTop - worldY) * zoomFactor;
                const newBottom = worldY - (worldY - camera.orthoBottom) * zoomFactor;
                
                // 更新相机视口范围
                camera.orthoLeft = newLeft;
                camera.orthoRight = newRight;
                camera.orthoTop = newTop;
                camera.orthoBottom = newBottom;
                
                camera.update();
            }
        });
    }

    private updateCameraViewRange(): void {
        if (!this.container) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;

        // 设置基准高度为2000
        const baseHeight = 2000;
        const baseWidth = baseHeight * aspect;

        // 设置正交相机范围
        this.camera.orthoLeft = -baseWidth;
        this.camera.orthoRight = baseWidth;
        this.camera.orthoTop = baseHeight;
        this.camera.orthoBottom = -baseHeight;
        this.camera.update();
    }

    public render(): void {
        // this.renderer.render(this.scene, this.camera);
    }

    /**
     * 添加物体到场景中
     * @param object 要添加的物体
     */
    public addObject(object: BABYLON.Mesh): void {
        // if (TemporaryVariable.scene2d) {
        //     object.parent = TemporaryVariable.scene2d;
        // }
    }

    /**
     * 从场景中移除物体
     * @param object 要移除的物体
     */
    public removeObject(object: BABYLON.Mesh): void {
        // this.scene.remove(object);
    }
}