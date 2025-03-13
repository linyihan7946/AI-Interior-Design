import * as THREE from 'three';
import { XthTree } from './XthTree';
import { JsonProperty } from '../bottomClass/Decorator';
import { ModelingTool } from '../bottomClass/ModelingTool';

export class XthObject extends XthTree {
    @JsonProperty()
    uuid: string = THREE.MathUtils.generateUUID();
    @JsonProperty()
    name: string = '';
    @JsonProperty()
    matrix2: THREE.Matrix4 = new THREE.Matrix4();
    @JsonProperty()
    matrixWorld2: THREE.Matrix4 = new THREE.Matrix4();
    @JsonProperty()
    matrix3: THREE.Matrix4 = new THREE.Matrix4();
    @JsonProperty()
    matrixWorld3: THREE.Matrix4 = new THREE.Matrix4();
    @JsonProperty()
    isVisible2: boolean = true;
    @JsonProperty()
    isVisible3: boolean = true;

    @JsonProperty()
    userData: any = {}; // 添加扩展数据属性

    @JsonProperty()
    normalMeshColor2: number = 0x00ff00; // 二维正常状态mesh的颜色

    @JsonProperty()
    normalLineColor2: number = 0x0000ff; // 二维正常状态line的颜色

    @JsonProperty()
    normalMeshColor3: number = 0x00ff00; // 三维正常状态mesh的颜色

    @JsonProperty()
    normalLineColor3: number = 0x0000ff; // 三维正常状态line的颜色

    [key: string]: any;
    @JsonProperty(false) // 控制object2不导出
    object2: THREE.Object3D = new THREE.Object3D();
    @JsonProperty(false) // 控制object3不导出
    object3: THREE.Object3D = new THREE.Object3D();

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
                if (value instanceof THREE.Matrix4) {
                    json[property] = value.toArray();
                } else if (value instanceof THREE.Vector3) {
                    json[property] = value.toArray();
                } else if (value instanceof THREE.Vector2) {
                    json[property] = value.toArray();
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
                if (this[property] instanceof THREE.Matrix4) {
                    this[property].fromArray(value);
                } else if (this[property] instanceof THREE.Vector3) {
                    this[property].fromArray(value);
                } else if (this[property] instanceof THREE.Vector2) {
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
     * @param {THREE.Matrix4} matrix 
     */
    applyMatrix4(matrix: THREE.Matrix4): void {
        this.matrix2.multiplyMatrices(matrix, this.matrix2);
        this.matrix3.multiplyMatrices(matrix, this.matrix3);
        // 更新对象的变换
        this.object2.applyMatrix4(matrix);
        this.object3.applyMatrix4(matrix);
    }

    remove(): void {
        super.remove();
    }

    build2d(): void {
    }

    build3d(): void {
    }

    rebuild(): void {
        this.build2d();
        this.build3d();
    }

    setParent(parent: XthTree): void {
        super.setParent(parent);
        if (parent instanceof XthObject) {
            parent.object2.add(this.object2);
            parent.object3.add(this.object3);
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
    public getNormalMeshColor2(): number {
        return this.normalMeshColor2;
    }

    /**
     * 设置二维正常状态mesh的颜色
     * @param color 颜色值
     */
    public setNormalMeshColor2(color: number): void {
        this.normalMeshColor2 = color;
    }

    /**
     * 获取二维正常状态line的颜色
     * @returns 颜色值
     */
    public getNormalLineColor2(): number {
        return this.normalLineColor2;
    }

    /**
     * 设置二维正常状态line的颜色
     * @param color 颜色值
     */
    public setNormalLineColor2(color: number): void {
        this.normalLineColor2 = color;
    }

    /**
     * 获取三维正常状态mesh的颜色
     * @returns 颜色值
     */
    public getNormalMeshColor3(): number {
        return this.normalMeshColor3;
    }

    /**
     * 设置三维正常状态mesh的颜色
     * @param color 颜色值
     */
    public setNormalMeshColor3(color: number): void {
        this.normalMeshColor3 = color;
    }

    /**
     * 获取三维正常状态line的颜色
     * @returns 颜色값
     */
    public getNormalLineColor3(): number {
        return this.normalLineColor3;
    }

    /**
     * 设置三维正常状态line的颜色
     * @param color 颜色값
     */
    public setNormalLineColor3(color: number): void {
        this.normalLineColor3 = color;
    }

    getSelfObject2(): THREE.Object3D {
        let selfObject2 = this.object2.children.find((child: any) => child.userData.isSelfObject === true);
        if (!selfObject2) {
            selfObject2 = new THREE.Object3D();
            selfObject2.userData.isSelfObject = true;
            this.object2.add(selfObject2);
        }
        return selfObject2;
    }

    getSelfObject3(): THREE.Object3D {
        let selfObject3 = this.object3.children.find((child: any) => child.userData.isSelfObject === true);
        if (!selfObject3) {
            selfObject3 = new THREE.Object3D();
            selfObject3.userData.isSelfObject = true;
            this.object3.add(selfObject3);
        }
        return selfObject3;
    }
}