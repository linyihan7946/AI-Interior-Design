import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Configure } from './Configure';

export class ModelingTool {
    /**
     * 根据二维点集生成带内孔的ShapeGeometry
     * @param shapeList 二维点集，第一圈是外圈，其余是内圈
     * @returns THREE.BufferGeometry
     */
    public static CreateShapeGeometry(shapeList1: THREE.Vector2[][] | THREE.Vector3[][]): THREE.BufferGeometry {
        if (shapeList1.length === 0) {
            throw new Error('Shape list cannot be empty');
        }
        const shapeList: THREE.Vector2[][] = [];
        shapeList1.forEach((shape) => {
            const shape2: THREE.Vector2[] = [];
            shape.forEach((point) => {
                shape2.push(new THREE.Vector2(point.x, point.y));
            });
            shapeList.push(shape2);
        });

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
    public static createExtrudedShape(points: THREE.Vector2[], depth: number, material: THREE.Material): THREE.Mesh {
        const shape = new THREE.Shape(points);
        const extrudeSettings = { depth, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        return new THREE.Mesh(geometry, material);
    }

    /**
     * 加载 GLTF 模型
     * @param url GLTF 文件路径
     * @returns 返回 Promise，解析为加载的模型
     */
    public static loadGLTF(url: string): Promise<THREE.Object3D> {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath(Configure.Instance.DRACO_PATH); // 设置 DRACOLoader 的解码器路径
            dracoLoader.setDecoderConfig({ "type": "js" }); // 不使用wasm，指定使用js; ljk. 20211023
            dracoLoader.preload();
            loader.setDRACOLoader(dracoLoader); // 将 DRACOLoader 实例传递给 GLTFLoader

            loader.load(
                url,
                (gltf) => {
                    resolve(gltf.scene);
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * 根据贴图长宽和平面BufferGeometry的长宽自动设置UV
     * @param geometry 平面BufferGeometry
     * @param textureWidth 贴图的宽度
     * @param textureHeight 贴图的高度
     */
    public static setAutoUV(geometry: THREE.BufferGeometry, textureWidth: number, textureHeight: number): void {
        const positions = geometry.attributes.position.array;
        const uvs = new Float32Array(positions.length / 3 * 2);

        // 获取平面的边界框
        const box = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position as THREE.BufferAttribute);
        const width = box.max.x - box.min.x;
        const height = box.max.y - box.min.y;

        // 计算UV比例
        const uvScaleX = textureWidth;// / width;
        const uvScaleY = textureHeight;// / height;

        for (let i = 0; i < positions.length / 3; i++) {
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];

            // 计算UV坐标，从左下角开始
            uvs[i * 2] = (x - box.min.x) / uvScaleX;
            uvs[i * 2 + 1] = (y - box.min.y) / uvScaleY;
        }

        // 设置UV属性
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
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