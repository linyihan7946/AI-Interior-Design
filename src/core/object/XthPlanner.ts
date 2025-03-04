import { XthObject } from './XthObject';

export class XthPlanner extends XthObject {
    constructor(json?: any) {
        super(json);
        // 确保构造函数的名字不会被改变
        Object.defineProperty(this.constructor, 'name', {
            value: 'XthPlanner',
            writable: false,
            configurable: true
        });
    }
}