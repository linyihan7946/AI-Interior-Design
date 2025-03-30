/*
 * @Author: LinYiHan
 * @Date: 2025-03-07 10:20:15
 * @Description: 
 * @Version: 1.0
 */

import * as BABYLON from '@babylonjs/core';

/**
 * 三维轨迹球控制类，继承自THREE.OrbitControls
 */
export class TrackballControls3D {
    private _camera: BABYLON.ArcRotateCamera;
    private _domElement: HTMLElement;

    constructor(camera: BABYLON.ArcRotateCamera, domElement: HTMLElement) {
        this._camera = camera;
        this._domElement = domElement;
        this._camera.attachControl(this._domElement, true);
    }
}