import * as BABYLON from '@babylonjs/core';
import { XthTree } from './XthTree';
import { JsonProperty } from '../bottomClass/Decorator';
import { ModelingTool } from '../bottomClass/ModelingTool';

export class XthObject extends XthTree {
    @JsonProperty()
    uuid: string = BABYLON.Tools.RandomId();
    @JsonProperty()
    name: string = '';
    @JsonProperty()
    matrix2 = BABYLON.Matrix.Identity();
    @JsonProperty()
    matrixWorld2 = BABYLON.Matrix.Identity();
    @JsonProperty()
    matrix3 = BABYLON.Matrix.Identity();
    @JsonProperty()
    matrixWorld3 = BABYLON.Matrix.Identity();
    @JsonProperty()
    isVisible2: boolean = true;
    @JsonProperty()
    isVisible3: boolean = true;

    @JsonProperty()
    userData: any = {}; // 添加扩展数据属性

    @JsonProperty()
    normalMeshColor2: BABYLON.Color3 = new BABYLON.Color3(0, 1, 0); // 二维正常状态mesh的颜色

    @JsonProperty()
    normalLineColor2: BABYLON.Color3 = new BABYLON.Color3(0, 0, 1); // 二维正常状态line的颜色

    @JsonProperty()
    normalMeshColor3: BABYLON.Color3 = new BABYLON.Color3(0, 1, 0); // 三维正常状态mesh的颜色

    @JsonProperty()
    normalLineColor3: BABYLON.Color3 = new BABYLON.Color3(0, 0, 1); // 三维正常状态line的颜色

    [key: string]: any;
    @JsonProperty(false) // 控制object2不导出
    object2: BABYLON.TransformNode = new BABYLON.TransformNode("object2");
    @JsonProperty(false) // 控制object3不导出
    object3: BABYLON.TransformNode = new BABYLON.TransformNode("object3");

    constructor(json?: any) {
        super();
        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthObject',
            writable: false,
            configurable: true
        });
        this.fromJSON(json);
    }

    toJSON(): any {
        const json: any = {};
        const properties = Object.getOwnPropertyNames(this);
        properties.forEach(property => {
            const shouldExport = Reflect.getMetadata('json:export', this, property);
            if (shouldExport) {
                const value = this[property];
                if (value instanceof BABYLON.Matrix) {
                    json[property] = value.toArray();
                } else if (value instanceof BABYLON.Vector3) {
                    const targetArray = new Array(3);
                    value.toArray(targetArray);
                    json[property] = targetArray;
                } else if (value instanceof BABYLON.Vector2) {
                    const targetArray = new Array(2);
                    value.toArray(targetArray);
                    json[property] = targetArray;
                } else {
                    json[property] = value;
                }
            }
        });
        return json;
    }

    fromJSON(json: any): void {
        if (!json) {
            return;
        }

        const properties = Object.getOwnPropertyNames(this);
        properties.forEach(property => {
            if (json[property] !== undefined) {
                const value = json[property];
                if (this[property] instanceof BABYLON.Matrix) {
                    this[property].fromArray(value);
                } else if (this[property] instanceof BABYLON.Vector3) {
                    this[property].fromArray(value);
                } else if (this[property] instanceof BABYLON.Vector2) {
                    this[property].fromArray(value);
                } else {
                    this[property] = value;
                }
            }
        });
    }

    clone(): XthObject {
        const cloned = new XthObject();
        cloned.fromJSON(this.toJSON());
        return cloned;
    }

    /**
     * 矩阵变换
     *
     * @param {BABYLON.Matrix} matrix 
     */
    applyMatrix4(matrix: BABYLON.Matrix): void {
        this.matrix2 = this.matrix2.multiply(matrix);
        this.matrix3 = this.matrix3.multiply(matrix);
        // 更新对象的变换
        ModelingTool.applyMatrix4(this.object2, matrix);
        ModelingTool.applyMatrix4(this.object3, matrix);
    }

    remove(): void {
        super.remove();
    }

    /***/
    rebuild(scene2: BABYLON.Scene | undefined, scene3: BABYLON.Scene | undefined): void {
        this.build2d(scene2);
        this.build3d(scene3);
    }

    build2d(scene2: BABYLON.Scene | undefined): void {
        // 默认实现为空
    }

    build3d(scene3: BABYLON.Scene | undefined): void {
        // 默认实现为空
    }
    /***/

    setParent(parent: XthTree): void {
        super.setParent(parent);
        if (parent instanceof XthObject) {
            this.object2.parent = parent.object2;
            this.object3.parent = parent.object3;
        }
    }

    isKindOf(type: Function): boolean {
        let proto = Object.getPrototypeOf(this);
        while (proto) {
            if (proto.constructor === type) {
                return true;
            }
            proto = Object.getPrototypeOf(proto);
        }
        return false;
    }

    isA(type: Function): boolean {
        return this.constructor === type;
    }

    /**
     * 设置扩展数据
     * @param key 键名
     * @param value 键值
     */
    public setUserData(key: string, value: any): void {
        this.userData[key] = value;
    }

    /**
     * 获取扩展数据
     * @param key 键名
     * @returns 键值
     */
    public getUserData(key: string): any {
        return this.userData[key];
    }

    /**
     * 移除扩展数据
     * @param key 键名
     */
    public removeUserData(key: string): void {
        delete this.userData[key];
    }

    /**
     * 获取二维正常状态mesh的颜色
     * @returns 颜色值
     */
    public getNormalMeshColor2(): BABYLON.Color3 {
        return this.normalMeshColor2;
    }

    /**
     * 设置二维正常状态mesh的颜色
     * @param color 颜色值
     */
    public setNormalMeshColor2(color: BABYLON.Color3): void {
        this.normalMeshColor2 = color;
    }

    /**
     * 获取二维正常状态line的颜色
     * @returns 颜色값
     */
    public getNormalLineColor2(): BABYLON.Color3 {
        return this.normalLineColor2;
    }

    /**
     * 设置二维正常状态line的颜色
     * @param color 颜色값
     */
    public setNormalLineColor2(color: BABYLON.Color3): void {
        this.normalLineColor2 = color;
    }

    /**
     * 获取三维正常状态mesh的颜色
     * @returns 颜色값
     */
    public getNormalMeshColor3(): BABYLON.Color3 {
        return this.normalMeshColor3;
    }

    /**
     * 设置三维正常状态mesh的颜色
     * @param color 颜色값
     */
    public setNormalMeshColor3(color: BABYLON.Color3): void {
        this.normalMeshColor3 = color;
    }

    /**
     * 获取三维正常状态line的颜色
     * @returns 颜色값
     */
    public getNormalLineColor3(): BABYLON.Color3 {
        return this.normalLineColor3;
    }

    /**
     * 设置三维正常状态line的颜色
     * @param color 颜色값
     */
    public setNormalLineColor3(color: BABYLON.Color3): void {
        this.normalLineColor3 = color;
    }

    getSelfObject2(): BABYLON.AbstractMesh {
        let selfObject2 = this.object2.getChildMeshes().find(child => (child.metadata && child.metadata.isSelfObject === true));
        if (!selfObject2) {
            selfObject2 = new BABYLON.Mesh("selfObject2");
            if (!selfObject2.metadata) {
                selfObject2.metadata = {};
            }
            selfObject2.metadata.isSelfObject = true;
            selfObject2.parent = this.object2;
        }
        return selfObject2;
    }

    getSelfObject3(): BABYLON.AbstractMesh {
        let selfObject3 = this.object3.getChildMeshes().find(child => (child.metadata && child.metadata.isSelfObject === true));
        if (!selfObject3) {
            selfObject3 = new BABYLON.Mesh("selfObject3");
            if (!selfObject3.metadata) {
                selfObject3.metadata = {};
            }
            selfObject3.metadata.isSelfObject = true;
            selfObject3.parent = this.object3;
        }
        return selfObject3;
    }
}