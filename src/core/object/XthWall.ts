import * as THREE from 'three';
import { XthObject } from './XthObject';
import { JsonProperty } from '../Decorator';

export class XthWall extends XthObject {
    @JsonProperty()
    startPoint: THREE.Vector3 = new THREE.Vector3();

    @JsonProperty()
    endPoint: THREE.Vector3 = new THREE.Vector3();

    @JsonProperty()
    thickness: number = 100; // 默认厚度改为100mm

    @JsonProperty()
    height: number = 2500; // 默认高度改为2500mm

    constructor(json?: any) {
        super(json);
        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthWall',
            writable: false,
            configurable: true
        });
    }
}