import * as THREE from 'three';

export class TrackballControls2D {
    private _domElement: HTMLElement;
    private _camera: THREE.OrthographicCamera;
    private _isDragging: boolean = false;
    private _lastMousePosition: THREE.Vector2 = new THREE.Vector2();

    /**
     * 构造函数
     * @param camera 要控制的相机对象
     * @param domElement 用于事件监听的DOM元素
     */
    constructor(camera: THREE.OrthographicCamera, domElement: HTMLElement) {
        this._camera = camera;
        this._domElement = domElement;
        this.addEventListener();
    }

    /**
     * 添加事件监听
     */
    public addEventListener(): void {
        this._domElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this._domElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this._domElement.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this._domElement.addEventListener('wheel', this.handleWheel.bind(this));
    }

    /**
     * 删除事件监听
     */
    public removeEventListener(): void {
        this._domElement.removeEventListener('mousedown', this.handleMouseDown);
        this._domElement.removeEventListener('mousemove', this.handleMouseMove);
        this._domElement.removeEventListener('mouseup', this.handleMouseUp);
        this._domElement.removeEventListener('wheel', this.handleWheel);
    }

    /**
     * 处理鼠标按下事件
     * @param event 鼠标事件
     */
    private handleMouseDown(event: MouseEvent): void {
        if (event.button === 0) { // 左键按下
            this._isDragging = true;
            this._lastMousePosition.set(event.clientX, event.clientY);
        }
    }

    /**
     * 处理鼠标移动事件
     * @param event 鼠标事件
     */
    private handleMouseMove(event: MouseEvent): void {
        if (this._isDragging) {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // 获取当前鼠标位置的世界坐标
            const worldPosition = new THREE.Vector3(mouse.x, mouse.y, 0);
            worldPosition.unproject(this._camera);

            // 获取上一次鼠标位置的世界坐标
            const lastMouse = new THREE.Vector2();
            lastMouse.x = (this._lastMousePosition.x / window.innerWidth) * 2 - 1;
            lastMouse.y = -(this._lastMousePosition.y / window.innerHeight) * 2 + 1;
            const lastWorldPosition = new THREE.Vector3(lastMouse.x, lastMouse.y, 0);
            lastWorldPosition.unproject(this._camera);

            // 计算世界坐标的差值
            const deltaWorldPosition = new THREE.Vector3().subVectors(worldPosition, lastWorldPosition);

            // 根据世界坐标的差值调整相机的位置
            this._camera.position.sub(deltaWorldPosition);

            this._lastMousePosition.set(event.clientX, event.clientY);
        }
    }

    /**
     * 处理鼠标弹起事件
     * @param event 鼠标事件
     */
    private handleMouseUp(event: MouseEvent): void {
        if (event.button === 0) { // 左键弹起
            this._isDragging = false;
        }
    }

    /**
     * 处理鼠标滚轮事件
     * @param event 滚轮事件
     */
    private handleWheel(event: WheelEvent): void {
        event.preventDefault();

        const zoomFactor = 0.1;
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 获取当前鼠标位置的世界坐标
        const worldPosition = new THREE.Vector3(mouse.x, mouse.y, 0);
        worldPosition.unproject(this._camera);

        if (event.deltaY < 0) {
            // 放大
            this._camera.zoom *= (1 + zoomFactor);
        } else {
            // 缩小
            this._camera.zoom /= (1 + zoomFactor);
        }

        // 更新相机投影矩阵
        this._camera.updateProjectionMatrix();

        // 重新计算鼠标位置的世界坐标
        const newWorldPosition = new THREE.Vector3(mouse.x, mouse.y, 0);
        newWorldPosition.unproject(this._camera);

        // 调整相机位置以保持鼠标点位置不变
        this._camera.position.sub(newWorldPosition).add(worldPosition);
    }
}