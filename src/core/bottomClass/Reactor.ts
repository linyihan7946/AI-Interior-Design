/*
 * @Author: LinYiHan
 * @Date: 2025-03-06 14:17:22
 * @Description: 反应器类，用于注册和执行反应器回调
 * @Version: 1.0
 */
export class Reactor {
    // 静态反应器列表，存储 key 和对应的回调函数数组
    private static reactorList: Map<string, Function[]> = new Map();

    /**
     * 注册反应器回调
     * @param key 反应器名称
     * @param callback 回调函数
     */
    public static registry(key: string, callback: Function): void {
        if (!Reactor.reactorList.has(key)) {
            Reactor.reactorList.set(key, []);
        }
        Reactor.reactorList.get(key)?.push(callback);
    }

    /**
     * 执行反应器回调
     * @param key 反应器名称
     * @param param 传递给回调函数的参数
     * @returns 返回所有回调函数的执行结果数组
     */
    public static run(key: string, param: any): any[] {
        const callbacks = Reactor.reactorList.get(key);
        if (!callbacks) {
            return [];
        }
        return callbacks.map(callback => callback(param));
    }
}