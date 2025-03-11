/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 15:39:17
 * @Description: 
 * @Version: 1.0
 */
export class BaseClass {
    // 类名属性
    public className: string;

    [key: string]: any;

    /**
     * 构造函数
     * @param json 可选参数，用于初始化对象
     */
    constructor(json?: any) {
        this.className = this.constructor.name;
        if (json) {
            this.fromJSON(json);
        }
    }

    /**
     * 序列化方法，将对象转换为 JSON 格式
     * @returns 返回对象的 JSON 表示
     */
    public toJSON(): any {
        const json: any = {};
        const properties = Object.getOwnPropertyNames(this);
        properties.forEach(property => {
            // 排除方法
            if (typeof this[property] !== 'function') {
                json[property] = this[property];
            }
        });
        return json;
    }

    /**
     * 反序列化方法，从 JSON 数据恢复对象
     * @param json JSON 数据
     */
    public fromJSON(json: any): void {
        const properties = Object.getOwnPropertyNames(this);
        properties.forEach(property => {
            if (json[property] !== undefined) {
                this[property] = json[property];
            }
        });
    }

    /**
     * 克隆方法，返回当前对象的副本
     * @returns 返回当前对象的副本
     */
    public clone(): BaseClass {
        const clone = new (this.constructor as any)();
        clone.copy(this);
        return clone;
    }

    /**
     * 拷贝方法，将源对象的属性复制到当前对象
     * @param sourceClass 源对象
     */
    public copy(sourceClass: BaseClass): void {
        const properties = Object.getOwnPropertyNames(sourceClass);
        properties.forEach(property => {
            if (typeof sourceClass[property] !== 'function') {
                this[property] = sourceClass[property];
            }
        });
    }
}