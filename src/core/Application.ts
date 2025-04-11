/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 14:14:06
 * @Description: 
 * @Version: 1.0
 */
import { SceneManager } from "./manager/SceneManager";
import { CommandManager } from "./command/CommandManager";
import { Configure } from "./bottomClass/Configure";
import { View3d } from './view/View3d';
import { ReactorManager } from "./manager/ReactorManager";
import { View2d } from "./view/View2d";
import { TemporaryVariable } from "./TemporaryVariable";

export class Application {
    private _sceneManager?: SceneManager;
    private _commandManager?: CommandManager;
    private _animationFrameId: number | null = null;
    private _view3d?: View3d;
    private _view2d?: View2d;

    // Getter and Setter for sceneManager
    public get sceneManager(): SceneManager {
        if (!this._sceneManager) {
            this._sceneManager = new SceneManager();
        }
        return this._sceneManager;
    }
    public set sceneManager(value: SceneManager) {
        this._sceneManager = value;
    }

    // Getter and Setter for commandManager
    public get commandManager(): CommandManager {
        if (!this._commandManager) {
            this._commandManager = new CommandManager();
        }
        return this._commandManager;
    }
    public set commandManager(value: CommandManager) {
        this._commandManager = value;
    }

    private _reactorManager?: ReactorManager;

    // Getter and Setter for reactorManager
    public get reactorManager(): ReactorManager {
        if (!this._reactorManager) {
            this._reactorManager = new ReactorManager();
        }
        return this._reactorManager;
    }
    public set reactorManager(value: ReactorManager) {
        this._reactorManager = value;
    }

    // Getter and Setter for animationFrameId
    public get animationFrameId(): number | null {
        return this._animationFrameId;
    }
    public set animationFrameId(value: number | null) {
        this._animationFrameId = value;
    }

    // Getter and Setter for view3d
    public get view3d(): View3d | undefined {
        return this._view3d;
    }

    public set view3d(value: View3d | undefined) {
        this._view3d = value;
    }

    // Getter and Setter for view2d
    public get view2d(): View2d | undefined {
        return this._view2d;
    }

    public set view2d(value: View2d | undefined) {
        this._view2d = value;
    }

    /**
     * 构造函数
     * @param param 可选参数，用于初始化应用程序
     */
    constructor() {
        
    }

    /**
     * 初始化应用程序
     */
    public initialize(param?: { view3dId?: string; view2dId?: string }): void {
        // 将 param 传递给 Configure 进行反序列化
        if (param) {
            Configure.Instance.fromJSON(param);
        }

        this.sceneManager;

        // 初始化 View3d，如果 param 中包含 view3dId
        if (param && param.view3dId) {
            this.view3d = new View3d(param.view3dId);
            TemporaryVariable.scene3d = this.view3d.scene;
        }

        // 初始化 View2d，如果 param 中包含 view2dId
        if (param && param.view2dId) {
            this.view2d = new View2d(param.view2dId);
        }

        this.reactorManager.registryAll();

        // 注册文件模块命令
        this.commandManager.registerFileCommands();

        // 初始化鼠标和键盘事件监听
        this.initEventListeners();

        // 启动帧循环
        this.start();

        console.log('Application initialized');
    }

    /**
     * 初始化鼠标和键盘事件监听
     */
    private initEventListeners(): void {
        document.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
        document.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
        document.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
        document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
    }

    /**
     * 处理鼠标按下事件
     * @param event 鼠标事件
     */
    private handleMouseDown(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.id === 'canvas3d' || target.id === 'canvas2dCanvas') {
            this.sceneManager.handleMouseDown(event); // 允许事件冒泡
        }
    }

    /**
     * 处理鼠标释放事件
     * @param event 鼠标事件
     */
    private handleMouseUp(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.id === 'canvas3d' || target.id === 'canvas2dCanvas') {
            this.sceneManager.handleMouseUp(event); // 允许事件冒泡
        }
    }

    /**
     * 处理鼠标移动事件
     * @param event 鼠标事件
     */
    private handleMouseMove(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.id === 'canvas3d' || target.id === 'canvas2dCanvas') {
            this.sceneManager.handleMouseMove(event);
        }
    }

    /**
     * 处理键盘按下事件
     * @param event 键盘事件
     */
    private handleKeyDown(event: KeyboardEvent): void {
        // 处理键盘按下事件
    }

    /**
     * 处理键盘释放事件
     * @param event 键盘事件
     */
    private handleKeyUp(event: KeyboardEvent): void {
        // 处理键盘释放事件
    }

    /**
     * 执行命令
     * @param command 命令名称
     * @param data 命令参数
     */
    public executeCommand(command: string, data: any): any {
        const commandInstance = this.commandManager.getCommand(command);
        if (commandInstance) {
            console.log("当前执行的命令为:%s, 参数为:", command, data);
            return commandInstance.executeCommand(data);
        } else {
            console.warn(`Command ${command} not found`);
        }
    }

    /**
     * 开启帧循环
     */
    public start(): void {
        if (this.animationFrameId === null) {
            const loop = () => {
                this.step();
                this.animationFrameId = requestAnimationFrame(loop);
            };
            this.animationFrameId = requestAnimationFrame(loop);
        }
    }

    /**
     * 帧循环
     */
    public step(): void {
        // 在这里添加每帧需要执行的逻辑
        // 例如更新场景、渲染等
        // if (this.view3d) {
        //     this.view3d.render();
        // }
        // if (this.view2d) {
        //     this.view2d.render();
        // }
    }

    /**
     * 停止帧循环
     */
    public end(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * 释放应用程序资源
     */
    public dispose(): void {
        // 释放场景管理器资源
        if (this.sceneManager) {
            // 这里可以添加释放场景管理器资源的逻辑
        }

        // 释放命令管理器资源
        if (this.commandManager) {
            // 这里可以添加释放命令管理器资源的逻辑
        }

        console.log('Application disposed');
    }
}