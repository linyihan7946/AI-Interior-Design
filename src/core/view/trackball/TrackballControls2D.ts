
import * as BABYLON from 'babylonjs';

export class TrackballControls2D {
    private _camera: BABYLON.ArcRotateCamera;
    private _domElement: HTMLElement;

    constructor(camera: BABYLON.ArcRotateCamera, domElement: HTMLElement) {
        this._camera = camera;
        this._domElement = domElement;
        this._camera.attachControl(this._domElement, true);
    }
}