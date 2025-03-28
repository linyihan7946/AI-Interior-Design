import { XthObject } from './XthObject';

export class XthScene extends XthObject {
    constructor(json?: any) {
        super(json);
        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthScene',
            writable: false,
            configurable: true
        });

        this.fromJSON(json);
    }
}