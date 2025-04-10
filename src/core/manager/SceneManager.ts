import { XthObject } from '../object/XthObject';
import { XthScene } from '../object/XthScene';
import { TemporaryVariable } from '../TemporaryVariable';

export class SceneManager {
    private scene?: XthScene;
    private selectedObject?: XthObject;
    private isDragging: boolean = false;
    private startX: number = 0;
    private startY: number = 0;

    constructor() {
    }

    /**
     * 处理鼠标按下事件
     * @param event 鼠标事件
     */
    public handleMouseDown(event: MouseEvent): void {
        this.isDragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;

        // 拾取物体
        const pickedObject = this.pickObject(event.clientX, event.clientY);
        if (pickedObject) {
            this.selectObject(pickedObject);
        } else {
            this.deselectObject();
        }
    }

    /**
     * 处理鼠标移动事件
     * @param event 鼠标事件
     */
    public handleMouseMove(event: MouseEvent): void {
        // if (this.isDragging && this.selectedObject) {
        //     const deltaX = event.clientX - this.startX;
        //     const deltaY = event.clientY - this.startY;

        //     // 更新物体位置
        //     this.selectedObject.object3.position.x += deltaX;
        //     this.selectedObject.object3.position.y += deltaY;

        //     this.startX = event.clientX;
        //     this.startY = event.clientY;
        // }
    }

    /**
     * 处理鼠标释放事件
     * @param event 鼠标事件
     */
    public handleMouseUp(event: MouseEvent): void {
        this.isDragging = false;
    }

    /**
     * 拾取物体
     * @param x 鼠标X坐标
     * @param y 鼠标Y坐标
     * @returns 拾取的物体
     */
    private pickObject(x: number, y: number): XthObject | undefined {
        const scene3d = TemporaryVariable.scene3d;
        if (!scene3d) {
            console.error('TemporaryVariable.scene3d is undefined. Ensure View3d is initialized before using SceneManager.');
            return undefined;   
        }

        const pickResult = scene3d.pick(x, y);
        if (pickResult.hit && pickResult.pickedMesh) {
            let parentNode = pickResult.pickedMesh.parent;
            while (parentNode) {
                const pickedNode = parentNode;
                if (pickedNode && pickedNode.metadata && pickedNode.metadata.object) {
                    return pickedNode.metadata.object as XthObject;
                }
                parentNode = parentNode.parent;
            }
        }
        return undefined;
    }

    /**
     * 选中物体
     * @param object 要选中的物体
     */
    public selectObject(object: XthObject): void {
        if (this.selectedObject) {
            this.selectedObject.setSelected(false); // 取消之前选中的物体
        }
        this.selectedObject = object;
        this.selectedObject.setSelected(true); // 选中新的物体
    }

    /**
     * 取消选中物体
     */
    public deselectObject(): void {
        if (this.selectedObject) {
            this.selectedObject.setSelected(false);
            this.selectedObject = undefined;
        }
    }

    /**
     * 获取当前选中的物体
     * @returns 当前选中的物体
     */
    public getSelectedObject(): XthObject | undefined {
        return this.selectedObject;
    }

    /**
     * 创建一个新的场景文件
     */
    public newFile(): void {
        this.scene = new XthScene();
    }

    /**
     * 设置当前场景
     * @param scene 要设置的场景
     */
    public setScene(scene: XthScene): void {
        this.scene = scene;
    }

    /**
     * 获取当前场景
     * @returns 当前场景
     */
    public getScene(): XthScene | undefined {
        return this.scene;
    }

    /**
     * 加载场景
     * @param json 场景数据
     * @returns 加载后的场景
     */
    public load(json: any): XthScene | undefined {
        if (!this.scene) {
            console.warn('Scene is not initialized');
            return undefined;
        }
        this.scene.fromJSON(json);
        return this.scene;
    }

    /**
     * 保存场景
     * @param param 保存参数
     * @returns 保存后的数据
     */
    public save(param: any): any {
        if (!this.scene) {
            console.warn('Scene is not initialized');
            return undefined;
        }
        return this.scene.toJSON();
    }

    /**
     * 保存场景到本地
     * @param param 保存参数
     * @returns 保存后的数据
     */
    public saveLocal(param: any): any {
        const data = this.save(param);
        if (!data) {
            return undefined;
        }
        // 这里可以添加将数据保存到本地的逻辑，例如使用 localStorage 或文件系统
        return data;
    }
}