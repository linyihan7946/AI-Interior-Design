import * as THREE from 'three';

export class Cube {
  private scene: THREE.Scene;
  private cube: THREE.Mesh;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.cube = this.createCube();
    this.scene.add(this.cube);
  }

  private createCube(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    return new THREE.Mesh(geometry, material);
  }

  public animate(): void {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
  }
}