import 'reflect-metadata';

// 定义装饰器函数
export function JsonProperty(shouldExport: boolean = true) {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata('json:export', shouldExport, target, propertyKey);
    };
}