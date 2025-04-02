import * as BABYLON from '@babylonjs/core';
import { ModelingTool } from '../bottomClass/ModelingTool';

export class TestUtils {
    public static test() {
        // console.log('TestUtils.test()');
        this.testMatrixStacking();
    }

    /**
     * 测试多层物体矩阵叠加是否有异常
     */
    public static testMatrixStacking(): void {
        const scene = new BABYLON.Scene(new BABYLON.NullEngine());
        const parentNode = new BABYLON.TransformNode("parentNode", scene);
        const childNode = new BABYLON.TransformNode("childNode", scene);
        // const grandChildNode = new BABYLON.TransformNode("grandChildNode", scene);
        const grandChildNode = BABYLON.MeshBuilder.CreateBox("box", {    width: 2,   height: 3,    depth: 1}, scene);

        // 设置层级关系
        childNode.parent = parentNode;
        grandChildNode.parent = childNode;

        // 创建矩阵并应用变换
        const matrix1 = BABYLON.Matrix.Translation(1, 0, 0);
        const matrix2 = BABYLON.Matrix.Translation(0, 1, 0);
        const matrix3 = BABYLON.Matrix.Translation(0, 0, 1);

        ModelingTool.applyMatrix4(parentNode, matrix1);
        ModelingTool.applyMatrix4(childNode, matrix2);
        ModelingTool.applyMatrix4(grandChildNode, matrix3);

        // grandChildNode.computeWorldMatrix(true); // 参数 true 表示递归更新所有父级

        // 获取最终的世界矩阵
        const finalWorldMatrix = grandChildNode.getWorldMatrix();

        // 预期结果：矩阵叠加后的变换应为 (1, 1, 1)
        const expectedTranslation = new BABYLON.Vector3(1, 1, 1);
        const actualTranslation = finalWorldMatrix.getTranslation();

        if (actualTranslation.equals(expectedTranslation)) {
            console.log("Matrix stacking test passed.");
        } else {
            console.error("Matrix stacking test failed. Expected:", expectedTranslation, "Actual:", actualTranslation);
        }
    }
}