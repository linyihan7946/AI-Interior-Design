import * as BABYLON from '@babylonjs/core';

export class Renderer {
  private scene: BABYLON.Scene;
  private camera: BABYLON.Camera;
  private engine: BABYLON.Engine;

  constructor(scene: BABYLON.Scene, camera: BABYLON.Camera, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.camera = camera;
    this.engine = new BABYLON.Engine(canvas, true);
  }

  public render(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}