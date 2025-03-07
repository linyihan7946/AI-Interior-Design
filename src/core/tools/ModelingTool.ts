class ModelingTool {
    /**
     * 创建平面图形
     * @returns 返回创建的平面图形
     */
    public createPlaneShape(): THREE.Object3D {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        return new THREE.Mesh(geometry, material);
    }

    /**
     * 创建拉伸造型
     * @returns 返回创建的拉伸造型
     */
    public createExtrudedShape(): THREE.Object3D {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(1, 0);
        shape.lineTo(1, 1);
        shape.lineTo(0, 1);
        shape.lineTo(0, 0);

        const extrudeSettings = { depth: 1, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        return new THREE.Mesh(geometry, material);
    }
}