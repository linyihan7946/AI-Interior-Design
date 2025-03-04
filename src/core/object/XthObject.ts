import * as THREE from 'three';
import { XthTree } from './XthTree';
import { JsonProperty } from '../Decorator';

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

    applyMatrix4(matrix: THREE.Matrix4): void {
        this.matrix3.multiplyMatrices(matrix, this.matrix3);
    }

    remove(): void {
        super.remove();
    }

    build2d(): void {
        // 原来的逻辑可以保留，但不再返回任何值
    }

    build3d(): void {
        // 原来的逻辑可以保留，但不再返回任何值
    }

    rebuild(): void {
        // Rebuild logic here
    }

    setParent(parent: XthTree): void {
        super.setParent(parent);
        if (parent instanceof XthObject) {
            parent.object3.add(this.object2);
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
}