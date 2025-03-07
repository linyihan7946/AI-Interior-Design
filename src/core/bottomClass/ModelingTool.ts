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

    /**
     * 创建平面图形
     * @param points 二维点集，用于定义平面形状
     * @param material 材质，用于渲染平面
     * @returns 返回创建的平面图形
     */
    public static createPlaneShape(points: THREE.Vector2[], material: THREE.Material): THREE.Object3D {
        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        return new THREE.Mesh(geometry, material);
    }

    /**
     * 创建拉伸造型
     * @param points 二维点集，用于定义拉伸轮廓
     * @param depth 拉伸深度
     * @param material 材质，用于渲染拉伸造型
     * @returns 返回创建的拉伸造型
     */
    public static createExtrudedShape(points: THREE.Vector2[], depth: number, material: THREE.Material): THREE.Object3D {
        const shape = new THREE.Shape(points);
        const extrudeSettings = { depth, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        return new THREE.Mesh(geometry, material);
    }

    /**
     * 删除Object3D并释放资源
     * @param object 要删除的Object3D对象
     * @param removeFromParent 是否从父物体上移除，默认为true
     */
    public static removeObject3D(object: THREE.Object3D, removeFromParent: boolean = false): void {
        // 遍历子孙物体
        object.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
                // 释放几何体和材质资源
                if (child.geometry) {
                    child.geometry.dispose();
                }
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((material: any) => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            }
        });

        // 从父级移除对象
        if (removeFromParent && object.parent) {
            object.parent.remove(object);
        }
    }
}