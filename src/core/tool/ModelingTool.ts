import * as THREE from 'three';

export class ModelingTool {
    /**
     * 根据二维点集生成带内孔的ShapeGeometry
     * @param shapeList 二维点集，第一圈是外圈，其余是内圈
     * @returns THREE.BufferGeometry
     */
    public static CreateShapeGeometry(shapeList: THREE.Vector2[][]): THREE.BufferGeometry {
        if (shapeList.length === 0) {
            throw new Error('Shape list cannot be empty');
        }

        // 创建外圈Shape
        const shape = new THREE.Shape(shapeList[0]);

        // 添加内圈Path
        for (let i = 1; i < shapeList.length; i++) {
            const hole = new THREE.Path(shapeList[i]);
            shape.holes.push(hole);
        }

        // 生成ShapeGeometry并返回
        return new THREE.ShapeGeometry(shape);
    }
}