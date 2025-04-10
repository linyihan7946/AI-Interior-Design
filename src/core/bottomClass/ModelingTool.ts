import { Configure } from './Configure';
import * as BABYLON from '@babylonjs/core';
import earcut from 'earcut';
import { TemporaryVariable } from './TemporaryVariable';
import "@babylonjs/loaders"; // 关键：引入插件

export class ModelingTool {
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
     * @param rootUrl GLTF 文件根路径
     * @param name GLTF 文件名
     * @param scene 场景对象
     * @returns 返回 Promise，解析为加载的模型
     */
    public static async loadGLTF(url: string, scene: BABYLON.Scene): Promise<BABYLON.TransformNode | undefined> {
        return new Promise((resolve, reject) => {
            // 配置 Draco 解码器路径
            BABYLON.DracoCompression.Configuration = {
                decoder: {
                    wasmUrl: "https://tx-wsai-cdn.yfway.com/sj/designtool/js/draco171/draco_decoder.wasm",
                    fallbackUrl: "https://tx-wsai-cdn.yfway.com/sj/designtool/js/draco171/draco_decoder.js"
                }
            };

            // 加载所有网格，从指定路径的 model.glb 文件
            BABYLON.SceneLoader.ImportMeshAsync(
                "", 
                url, 
                "", 
                scene, 
                (event) => console.log(`加载进度: ${event.loaded}/${event.total}`),
                ".glb"
            ).then((result) => {
                const node = new BABYLON.TransformNode("node");
                result.meshes.forEach((mesh) => {
                    mesh.parent = node;
                });
                resolve(node);
            }, (error) => {
                console.error('Failed to load GLTF model:', error);
                reject(undefined);
            });
        });
    }

    /**
     * 获取节点及其子节点下所有 Mesh 的合并包围盒
     * @param rootNode 根节点（TransformNode 或 Mesh）
     * @returns 整体包围盒（若节点下无 Mesh 则返回 null）
     */
    public static getHierarchyBoundingBox(rootNode: BABYLON.Node): BABYLON.BoundingInfo | null {
        // 收集所有子 Mesh
        const meshes: BABYLON.Mesh[] = [];
        if (rootNode instanceof BABYLON.Mesh) {
            meshes.push(rootNode);
        }
        const childMeshes = rootNode.getChildMeshes(false) as BABYLON.Mesh[];
        meshes.push(...childMeshes);

        if (meshes.length === 0) return null;

        // 初始化全局最小/最大值
        let globalMin = new BABYLON.Vector3(Infinity, Infinity, Infinity);
        let globalMax = new BABYLON.Vector3(-Infinity, -Infinity, -Infinity);

        // 遍历所有 Mesh 并合并包围盒
        meshes.forEach(mesh => {
            const boundingInfo = mesh.getBoundingInfo();
            const localMin = boundingInfo.boundingBox.minimumWorld;
            const localMax = boundingInfo.boundingBox.maximumWorld;

            globalMin = BABYLON.Vector3.Minimize(globalMin, localMin);
            globalMax = BABYLON.Vector3.Maximize(globalMax, localMax);
        });

        return new BABYLON.BoundingInfo(globalMin, globalMax);
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
    public static removeObject3D(object: BABYLON.Node, removeFromParent: boolean = false): void {
        // 定义一个函数来彻底删除 Mesh

        // 解除与父对象的关联
        if (removeFromParent && object.parent) {
            object.parent = null;
        }

        // 移除所有子对象
        const childMeshes = object.getChildren();
        childMeshes.forEach((childMesh) => {
            this.removeObject3D(childMesh, true);
        });

        // 从场景中移除 Mesh
        if (removeFromParent) {
            object.dispose(false, false);
        }

        // 遍历子孙物体
        // this.traverse(object, (child) => {
        //     if (child instanceof BABYLON.Mesh) {
        //         // 释放几何体和材质资源
        //         if (child.geometry) {
        //             child.geometry.dispose();
        //         }
        //         if (child.material) {
        //             if (Array.isArray(child.material)) {
        //                 child.material.forEach((material: any) => material.dispose());
        //             } else {
        //                 child.material.dispose();
        //             }
        //         }
        //     }
        // });

        // // 从父级移除对象
        // if (removeFromParent && object.parent) {
        //     object.parent = null;
        // }
    }

    public static setTransformNodeMatrix(transformNode: BABYLON.TransformNode, matrix: BABYLON.Matrix): void {
        transformNode.setPreTransformMatrix(matrix);
        // const scale = new BABYLON.Vector3();
        // const rotation = new BABYLON.Quaternion();
        // const translation = new BABYLON.Vector3();
        // matrix.decompose(scale, rotation, translation);
        // transformNode.position = translation;
        // transformNode.rotationQuaternion = rotation; // 使用四元数
        // transformNode.scaling = scale;
    }

    public static applyMatrix4(node: BABYLON.TransformNode, matrix: BABYLON.Matrix): BABYLON.TransformNode {
        const originalParent = node.parent;
        const intermediateNode = new BABYLON.TransformNode("transformNode");
        intermediateNode.parent = originalParent;
        node.parent = intermediateNode;
        this.setTransformNodeMatrix(intermediateNode, matrix);
        node.computeWorldMatrix(true);
        return intermediateNode;
    }

    public static setColor(color: BABYLON.Color3, hexValue: number): void {
        color.r = ((hexValue >> 16) & 0xff) / 255; // 0xcc → 204 → 0.8
        color.g = ((hexValue >> 8) & 0xff) / 255;  // 0xcc → 204 → 0.8
        color.b = (hexValue & 0xff) / 255;         // 0xcc → 204 → 0.8
    }

    /**
     * 获取当前 transformNode 节点的连续名字为 "transformNode" 的最顶级的 transformNode 节点
     * @param transformNode 当前 transformNode 节点
     * @returns 最顶级的 transformNode 节点
     */
    public static getTopTransformNode(transformNode: BABYLON.TransformNode): BABYLON.TransformNode {
        let currentNode = transformNode;
        while (currentNode.parent && currentNode.parent.name === "transformNode") {
            currentNode = currentNode.parent as BABYLON.TransformNode;
        }
        return currentNode;
    }

    /**
     * 根据 TransformNode 生成或删除包络框
     * @param node 要生成或删除包络框的 TransformNode
     * @param scene 场景对象
     * @param create 是否生成包络框，默认为 true
     */
    public static toggleBoundingBox(node: BABYLON.TransformNode, scene?: BABYLON.Scene, create: boolean = true): void {
        // 查找是否已经存在包络框
        const boundingBoxNode = node.getChildTransformNodes().find(child => child.name === "boundingBox");

        if (create) {
            // 如果已经存在包络框，则先删除
            if (boundingBoxNode) {
                this.removeObject3D(boundingBoxNode, true);
            }

            // 获取节点的包围盒
            const boundingInfo = this.getHierarchyBoundingBox(node);
            if (!boundingInfo) return;

            // 创建包络框
            const boundingBox = BABYLON.MeshBuilder.CreateBox("boundingBox", {
                width: boundingInfo.boundingBox.maximumWorld.x - boundingInfo.boundingBox.minimumWorld.x,
                height: boundingInfo.boundingBox.maximumWorld.y - boundingInfo.boundingBox.minimumWorld.y,
                depth: boundingInfo.boundingBox.maximumWorld.z - boundingInfo.boundingBox.minimumWorld.z
            }, scene);

            // 设置包络框的位置为包围盒的中心
            const center = boundingInfo.boundingBox.center;
            boundingBox.position = center;

            // 设置包络框的父节点为当前节点
            boundingBox.parent = node;

            // 设置包络框的材质为线框材质
            const material = new BABYLON.StandardMaterial("boundingBoxMaterial", scene);
            material.wireframe = true;
            material.emissiveColor = new BABYLON.Color3(1, 0, 0); // 红色线框
            boundingBox.material = material;
        } else {
            // 如果不需要生成包络框，则删除已有的包络框
            if (boundingBoxNode) {
                this.removeObject3D(boundingBoxNode, true);
            }
        }
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