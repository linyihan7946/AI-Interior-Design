export abstract class CommandBase {

    // 命令基类名称
    protected name: string = '';

    // 是否记录回退
    protected shouldRecordUndo: boolean = false;

    // 是否取消上一个命令
    protected shouldCancelPreviousCommand: boolean = false;

    /**
     * 构造函数
     * @param param 可选参数，用于初始化命令
     */
    constructor(param?: any) {
        if (param) {
            this.name = param.name || this.name;
            this.shouldRecordUndo = param.shouldRecordUndo || false;
            this.shouldCancelPreviousCommand = param.shouldCancelPreviousCommand || false;
        }
    }

    /**
     * 执行命令
     * @param args 命令参数
     */
    public executeCommand(...args: any[]): any {
        // 空函数，具体实现由子类完成
    }
}