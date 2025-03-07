

// 全局命令列表
const commandRegistry: Map<string, Function> = new Map();

// 命令装饰器，用于自动注册命令
export function Command(name: string) {
    return function (constructor: Function) {
        // 将命令名称和构造函数存储在全局命令列表中
        commandRegistry.set(name, constructor);
    };
}

// 获取命令注册表
export function getCommandRegistry(): Map<string, Function> {
    return commandRegistry;
}