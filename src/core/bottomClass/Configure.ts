/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 15:39:17
 * @Description: 
 * @Version: 1.0
 */
import { BaseClass } from './BaseClass';
import { OpeningType } from '../enum/OpeningType';

export class Configure extends BaseClass {
    private static _instance: Configure = new Configure();

    // 添加环境光强度配置
    public ambientLightIntensity2: number = 1.0 * Math.PI; // 二维环境光强度
    public ambientLightIntensity3: number = 1.0 * Math.PI; // 三维环境光强度

    // 添加 GLTF 文件路径配置
    public gltfPaths: { [key: number]: string } = {
        [OpeningType.SingleDoor]: 'https://tx-wsai-cdn.yfway.com/168s/gltfs/54cde3a30b7c51621971fdb33947bee4.glb',
        [OpeningType.DoubleDoor]: 'https://tx-wsai-cdn.yfway.com/168s/gltfs/54cde3a30b7c51621971fdb33947bee4.glb',
        [OpeningType.MotherChildDoor]: 'https://tx-wsai-cdn.yfway.com/168s/gltfs/54cde3a30b7c51621971fdb33947bee4.glb',
        [OpeningType.SlidingDoor]: 'https://tx-wsai-cdn.yfway.com/168s/gltfs/54cde3a30b7c51621971fdb33947bee4.glb',
        [OpeningType.BalconyDoor]: 'https://tx-wsai-cdn.yfway.com/168s/gltfs/54cde3a30b7c51621971fdb33947bee4.glb',
        [OpeningType.StraightWindow]: 'https://tx-wsai-cdn.yfway.com/168s/gltfs/54cde3a30b7c51621971fdb33947bee4.glb',
        [OpeningType.BayWindow]: 'https://tx-wsai-cdn.yfway.com/168s/gltfs/54cde3a30b7c51621971fdb33947bee4.glb'
    };

    // 添加 view3dId 属性
    public view3dId?: string;

    // 添加 view2dId 属性
    public view2dId?: string;

    // 添加墙体颜色相关属性
    public wallMeshColor2: number = 0x333333; // 默认墙体二维mesh颜色改为深灰色
    public wallLineColor2: number = 0x0000ff; // 默认墙体二维line颜色
    public wallMeshColor3: number = 0x333333; // 默认墙体三维mesh颜色改为深灰色
    public wallLineColor3: number = 0x0000ff; // 默认墙体三维line颜色

    // 添加网格线颜色配置项
    public gridLineColor2: number = 0x808080; // 默认二维网格线颜色改为深灰色
    public gridLineColor3: number = 0x808080; // 默认三维网格线颜色改为深灰色

    // 添加网格线等分数配置项
    public gridDivisions2: number = 100; // 默认二维网格线等分数
    public gridDivisions3: number = 100; // 默认三维网格线等分数

    // 添加地面颜色配置项
    public groundMeshColor2: number = 0xcccccc; // 默认二维地面mesh颜色改为浅灰色
    public groundMeshColor3: number = 0xcccccc; // 默认三维地面mesh颜色改为浅灰色

    public DRACO_PATH = "https://tx-wsai-cdn.yfway.com/sj/designtool/js/draco171/";

    // 添加墙面贴图路径配置
    public wallTexturePath: string = 'https://tx-wsai-cdn.yfway.com/168s/images/824fba06b8dc4696d98eacfacca15edc.jpg?imageMogr2/thumbnail/256x256';

    // 添加地面贴图路径配置
    public groundTexturePath: string = 'https://tx-wsai-cdn.yfway.com/168s/images/407e31f59b7bd04c572863138fe7f9ea.jpg?imageMogr2/thumbnail/260x260';

    // 添加背景颜色配置
    public backgroundColor2: number = 0x050505; // 二维场景背景颜色 - 更浅的灰色
    public backgroundColor3: number = 0xe0e0e0; // 三维场景背景颜色 - 稍深的灰色

    // 私有构造函数，防止外部实例化
    private constructor(json?: any) {
        super(json);
    }

    // 获取单例实例
    public static get Instance(): Configure {
        return this._instance;
    }
}