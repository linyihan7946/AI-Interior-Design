/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 14:17:22
 * @Description: 反应器名称列表，定义常用的反应器名称
 * @Version: 1.0
 */
export class ReactorNameList {
    // 打开场景前的反应器名称
    public static readonly BEFORE_OPEN_SCENE = 'beforeOpenScene';

    // 打开场景后的反应器名称
    public static readonly AFTER_OPEN_SCENE = 'afterOpenScene';

    // Object3D 改变后的反应器名称
    public static readonly AFTER_OBJECT3D_CHANGED = 'afterObject3DChanged';

    // 材质改变后的反应器名称
    public static readonly AFTER_MATERIAL_CHANGED = 'afterMaterialChanged';

    // 贴图改变后的反应器名称
    public static readonly AFTER_TEXTURE_CHANGED = 'afterTextureChanged';
}