import * as BABYLON from '@babylonjs/core';

export class Cube {
  private scene: BABYLON.Scene;
  private cube: BABYLON.Mesh;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.cube = this.createCube();
    this.scene.addMesh(this.cube);
  }

  private createCube(): BABYLON.Mesh {
    const cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 1 }, this.scene);
    const material = new BABYLON.StandardMaterial("cubeMaterial", this.scene);
    material.diffuseColor = new BABYLON.Color3(0, 1, 0);
    cube.material = material;
    return cube;
  }

  public animate(): void {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
  }
}