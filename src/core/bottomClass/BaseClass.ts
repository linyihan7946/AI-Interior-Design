export class BaseClass {
    // 类名属性
    public className: string;

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
        return {
            className: this.className,
            // 可以根据需要添加更多属性
        };
    }

    /**
     * 反序列化方法，从 JSON 数据恢复对象
     * @param json JSON 数据
     */
    public fromJSON(json: any): void {
        if (json.className) {
            this.className = json.className;
        }
        // 可以根据需要恢复更多属性
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
        this.className = sourceClass.className;
        // 可以根据需要复制更多属性
    }
}