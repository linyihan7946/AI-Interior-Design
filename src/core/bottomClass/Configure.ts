import { BaseClass } from './BaseClass';

export class Configure extends BaseClass {
    private static _instance: Configure = new Configure();

    // 添加 view3dId 属性
    public view3dId?: string;

    // 添加墙体颜色相关属性
    public wallMeshColor2: number = 0x00ff00; // 默认墙体二维mesh颜色
    public wallLineColor2: number = 0x0000ff; // 默认墙体二维line颜色
    public wallMeshColor3: number = 0x00ff00; // 默认墙体三维mesh颜色
    public wallLineColor3: number = 0x0000ff; // 默认墙体三维line颜色

    // 私有构造函数，防止外部实例化
    private constructor(json?: any) {
        super(json);
        if (json && json.view3dId) {
            this.view3dId = json.view3dId;
        }
    }

    // 获取单例实例
    public static get Instance(): Configure {
        return this._instance;
    }
}