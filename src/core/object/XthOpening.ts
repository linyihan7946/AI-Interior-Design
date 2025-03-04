/*
 * @Author: LinYiHan
 * @Date: 2025-03-04 16:36:28
 * @Description: 
 * @Version: 1.0
 */
import * as THREE from 'three';
import { XthObject } from './XthObject';
import { JsonProperty } from '../Decorator';

export enum OpeningType {
    SingleDoor = 0,
    DoubleDoor = 1,
    MotherChildDoor = 2,
    SlidingDoor = 3,
    BalconyDoor = 4,
    StraightWindow = 5,
    BayWindow = 6
}

export class XthOpening extends XthObject {
    @JsonProperty()
    elevation: number = 0; // 默认高度为0mm

    @JsonProperty()
    height: number = 2100; // 默认高度改为2100mm

    @JsonProperty()
    type: OpeningType = OpeningType.SingleDoor;

    @JsonProperty()
    length: number = 900; // 默认长度改为900mm

    @JsonProperty()
    thickness: number = 100; // 默认厚度改为100mm

    constructor(json?: any) {
        super(json);
        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthOpening',
            writable: false,
            configurable: true
        });
    }
}