import { Configure } from './Configure';
import * as BABYLON from 'babylonjs';
import earcut from 'earcut';
import { TemporaryVariable } from './TemporaryVariable';
// import { Earcut } from "babylonjs";

export class ModelingTool {
    /**
     * 创建平面图形
     * @param points 二维点集，用于定义平面形状
     * @param material 材质，用于渲染平面
     * @returns 返回创建的平面图形
     */
    public static createPlaneShape(points: BABYLON.Vector2[], scene?: BABYLON.Scene): BABYLON.Mesh {
        return this.CreateShapeGeometry([points], scene);
    }

    /**
     * 创建拉伸造型
     * @param points 二维点集，用于定义拉伸轮廓
     * @param depth 拉伸深度
     * @param material 材质，用于渲染拉伸造型
     * @returns 返回创建的拉伸造型
     */
    public static createExtrudedShape(points: BABYLON.Vector2[], depth: number, material: BABYLON.Material, scene?: BABYLON.Scene): BABYLON.Mesh {
        const path: BABYLON.Vector3[] = [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, depth)
        ];
        const shape = BABYLON.MeshBuilder.ExtrudeShape("extrudedShape", { shape: points.map(p => new BABYLON.Vector3(p.x, p.y, 0)), path }, scene);
        shape.material = material;
        return shape;
    }

    /**
     * 加载 GLTF 模型
     * @param url GLTF 文件路径
     * @returns 返回 Promise，解析为加载的模型
     */
    public static loadGLTF(url: string): Promise<BABYLON.Mesh> {
        return new Promise((resolve, reject) => {
            // 确保加载了 GLB 插件
            BABYLON.SceneLoader.OnPluginActivatedObservable.addOnce((loader) => {
                if (loader.name === "gltf") {
                    BABYLON.SceneLoader.ImportMesh("", "", url, TemporaryVariable.scene3d, (meshes) => {
                        if (meshes.length > 0) {
                            resolve(meshes[0] as BABYLON.Mesh);
                        } else {
                            reject(new Error("No meshes found in the GLTF file."));
                        }
                    }, undefined, (error) => {
                        reject(error);
                    });
                }
            });
        });
    }

    /**
     * 根据顶点数据自动设置UV，UV的值范围都是0-1
     * @param vertexData 顶点数据
     */
    public static setAutoUV(vertexData: BABYLON.VertexData): void {
        const positions = vertexData.positions;
        if (!positions) return;

        // 计算包络框
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }

        // 计算UV
        const uvs: number[] = [];
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const u = (x - minX) / (maxX - minX);
            const v = (y - minY) / (maxY - minY);
            uvs.push(u, v);
        }

        // 设置UV属性
        vertexData.uvs = uvs;
    }

    public static traverse(node: BABYLON.Node, callback: (child: BABYLON.Node) => void) {
        const children = node.getChildren();
        for (const child of children) {
            callback(child); // 处理当前子节点
            this.traverse(child, callback); // 递归处理子节点的子节点
        }
    }

    /**
     * 删除Object3D并释放资源
     * @param object 要删除的Object3D对象
     * @param removeFromParent 是否从父物体上移除，默认为true
     */
    public static removeObject3D(object: BABYLON.AbstractMesh, removeFromParent: boolean = false): void {
        // 遍历子孙物体
        this.traverse(object, (child) => {
            if (child instanceof BABYLON.Mesh) {
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
            object.parent = null;
        }
    }

    public static setTransformNodeMatrix(transformNode: BABYLON.TransformNode, matrix: BABYLON.Matrix): void {
        const scale = new BABYLON.Vector3();
        const rotation = new BABYLON.Quaternion();
        const translation = new BABYLON.Vector3();
        matrix.decompose(scale, rotation, translation);
        transformNode.position = translation;
        transformNode.rotationQuaternion = rotation; // 使用四元数
        transformNode.scaling = scale;
    }

    public static applyMatrix4(mesh: BABYLON.TransformNode, matrix: BABYLON.Matrix): void {
        // 假设 mesh 已有父节点 originalParent
        const originalParent = mesh.parent;

        // 创建中间 TransformNode
        const intermediateNode = new BABYLON.TransformNode("intermediateNode");
        intermediateNode.parent = originalParent; // 中间节点继承原父节点

        // 将 Mesh 的父节点设为中间节点
        mesh.parent = intermediateNode;

        // 调整中间节点的矩阵以继承原 Mesh 的变换
        const originalMatrix = mesh.computeWorldMatrix(true); // 获取原世界矩阵
        const newMatrix = originalMatrix.multiply(matrix);
        this.setTransformNodeMatrix(intermediateNode, newMatrix);

        // 将 Mesh 的局部变换重置（因其父节点现在是中间节点）
        mesh.position = BABYLON.Vector3.Zero();
        mesh.rotation = BABYLON.Vector3.Zero();
        mesh.scaling = BABYLON.Vector3.One();

        // 后续矩阵叠加操作针对中间节点
        intermediateNode.computeWorldMatrix(true);
    }

    public static setColor(color: BABYLON.Color3, hexValue: number): void {
        color.r = ((hexValue >> 16) & 0xff) / 255; // 0xcc → 204 → 0.8
        color.g = ((hexValue >> 8) & 0xff) / 255;  // 0xcc → 204 → 0.8
        color.b = (hexValue & 0xff) / 255;         // 0xcc → 204 → 0.8
    }

    // 创建一个多边形外圈且有多个内孔的平面Mesh
    public static CreateShapeGeometry(points: BABYLON.Vector2[][] | BABYLON.Vector3[][], scene?: BABYLON.Scene, name?: string): BABYLON.Mesh {
        // 将 Vector3[][] 转换为 Vector2[][] 如果传入的是 Vector3
        const points2D = points.map(polygon => polygon.map(point => {
            if (point instanceof BABYLON.Vector3) {
                return new BABYLON.Vector2(point.x, point.y); // 使用 x 和 y 坐标
            }
            return point;
        }));

        // 使用 earcut 进行三角剖分
        const vertices: number[] = [];
        const holes: number[] = [];
        const dimensions = 2;

        // 添加外圈顶点
        points2D[0].forEach(point => {
            vertices.push(point.x, point.y);
        });

        // 添加内孔顶点
        for (let i = 1; i < points2D.length; i++) {
            const holeStart = vertices.length / dimensions;
            points2D[i].forEach(point => {
                vertices.push(point.x, point.y);
            });
            holes.push(holeStart);
        }

        const indices = earcut(vertices, holes, dimensions);
        
        // 创建网格
        const meshName = name ? name : "polygon";
        const mesh = new BABYLON.Mesh(meshName, scene);
        const vertexData = new BABYLON.VertexData();
        
        // 设置顶点位置
        const positions: number[] = [];
        for (let i = 0; i < vertices.length; i += 2) {
            positions.push(vertices[i], vertices[i + 1], 0); // 添加 z 坐标为 0
        }
        vertexData.positions = positions;
        
        // 设置索引
        vertexData.indices = indices;
        
        // 设置法线（所有法线都朝上）
        const normals: number[] = [];
        for (let i = 0; i < positions.length / 3; i++) {
            normals.push(0, 0, 1);
        }
        vertexData.normals = normals;

        this.setAutoUV(vertexData);
        
        // 应用顶点数据
        vertexData.applyToMesh(mesh);
        
        // 确保网格是双面的
        mesh.isPickable = true;
        mesh.convertToUnIndexedMesh();
        
        return mesh;
    }

    // 创建网格线
    // public static CreateGrid(width: number, height: number, subdivisions: number, scene: BABYLON.Scene): BABYLON.Mesh {
    //     // 创建一个平面作为地面
    //     const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    //         width,
    //         height,
    //         subdivisions
    //     }, scene);

    //     const gridMaterial = new BABYLON.GridMaterial("gridMat", scene);
    //     gridMaterial.majorUnitFrequency = 1;       // 主网格线间距（单位：单元格）
    //     gridMaterial.minorUnitVisibility = 0.4;   // 次网格线透明度（0~1）
    //     gridMaterial.gridRatio = 1;                // 次网格线与主网格线的比例（例如 1 表示次网格线间距是主网格线的 1/5）
    //     gridMaterial.mainColor = new BABYLON.Color3(1, 0, 0); // 主网格线颜色（红色）
    //     gridMaterial.lineColor = new BABYLON.Color3(0, 1, 0); // 次网格线颜色（绿色）

    //     // 应用材质到地面
    //     ground.material = gridMaterial;
    // }
}