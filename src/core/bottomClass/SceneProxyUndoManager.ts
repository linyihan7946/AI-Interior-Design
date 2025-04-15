import * as BABYLON from '@babylonjs/core';
import { TemporaryVariable } from "./TemporaryVariable";

export type ChangeRecord = {
    type: 'add' | 'remove' | 'modify',
    target: any,
    property?: string,
    oldValue?: any,
    newValue?: any,
    parent?: any,
    index?: number,
    objectSnapshot?: any, // 用于add/remove时的对象快照
};

export class UndoManager {
    private undoStack: ChangeRecord[][] = [];
    private redoStack: ChangeRecord[][] = [];
    private currentBatch: ChangeRecord[] = [];
    public isBatching = false;

    startBatch() {
        this.currentBatch = [];
        this.isBatching = true;
    }
    endBatch() {
        if (this.currentBatch.length > 0) {
            this.undoStack.push(this.currentBatch);
            this.redoStack = [];
        }
        this.isBatching = false;
    }
    record(change: ChangeRecord) {
        if (this.isBatching) {
            this.currentBatch.push(change);
        }
    }

    isXthObject(obj: any) {
        return obj && typeof obj.isKindOf === 'function' && obj.isKindOf('_XthObject');
    }

    undo() {
        const batch = this.undoStack.pop();
        if (!batch) return;
        const objList: Map<string, any> = new Map();
        for (let i = batch.length - 1; i >= 0; i--) {
            const c = batch[i];
            if (c.type === 'add') {
                // 调用XthObject的onRemoveFromParent
                if (typeof c.objectSnapshot?.remove === 'function') {
                    c.objectSnapshot.remove();
                }
                c.parent.children.splice(c.index!, 1);
                if (this.isXthObject(c.parent)) {
                    objList.set(c.parent.uuid, c.parent);
                }
            } else if (c.type === 'remove') {
                c.parent.children.splice(c.index!, 0, c.objectSnapshot);
                if (typeof c.objectSnapshot?.setParent === 'function') {
                    c.objectSnapshot.setParent(c.parent);
                }
                c.objectSnapshot.parent = c.parent;
                if (this.isXthObject(c.objectSnapshot)) {
                    objList.set(c.objectSnapshot.uuid, c.objectSnapshot);
                }
            } else if (c.type === 'modify') {
                c.target[c.property!] = c.oldValue;
                if (this.isXthObject(c.target)) {
                    objList.set(c.target.uuid, c.target);
                }
            }
        }
        this.redoStack.push(batch);
        objList.forEach(o => {
            if (o.isKindOf("XthScene")) {
                return;
            }
            if (typeof o?.rebuild === 'function') {
                o.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);
            }
        });
    }
    redo() {
        const batch = this.redoStack.pop();
        if (!batch) return;
        const objList: Map<string, any> = new Map();
        for (const c of batch) {
            if (c.type === 'add') {
                c.parent.children.splice(c.index!, 0, c.objectSnapshot);
                if (typeof c.objectSnapshot?.setParent === 'function') {
                    c.objectSnapshot.setParent(c.parent);
                }
                c.objectSnapshot.parent = c.parent;
                if (this.isXthObject(c.objectSnapshot)) {
                    objList.set(c.objectSnapshot.uuid, c.objectSnapshot);
                }
            } else if (c.type === 'remove') {
                if (typeof c.objectSnapshot?.remove === 'function') {
                    c.objectSnapshot.remove();
                }
                c.parent.children.splice(c.index!, 1);
                if (this.isXthObject(c.parent)) {
                    objList.set(c.parent.uuid, c.parent);
                }
            } else if (c.type === 'modify') {
                c.target[c.property!] = c.newValue;
                if (this.isXthObject(c.target)) {
                    objList.set(c.target.uuid, c.target);
                }
            }
        }
        this.undoStack.push(batch);
        objList.forEach(o => {
            if (o.isKindOf("XthScene")) {
                return;
            }
            if (typeof o?.rebuild === 'function') {
                o.rebuild(TemporaryVariable.scene2d, TemporaryVariable.scene3d);
            }
        });
    }
}

export function canProxy(obj: any): boolean {
    if (obj && typeof obj === 'object' && obj !== null && !obj.__isProxy) {
        if (obj instanceof BABYLON.TransformNode) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

export function createSceneProxy(scene: any, undoManager: UndoManager): any {
    function wrap(obj: any, parent?: any, visited = new WeakSet()) {
        if (!canProxy(obj) || visited.has(obj)) {
            return obj;
        }
        visited.add(obj);
        const handler: ProxyHandler<any> = {
            get(target, prop, receiver) {
                const value = Reflect.get(target, prop, receiver);
                if (prop === 'children' && Array.isArray(value)) {
                    return new Proxy(value, {
                        get(arr, arrProp, arrReceiver) {
                            if (['push', 'splice', 'unshift'].includes(arrProp as string)) {
                                return function (...args: any[]) {
                                    args.forEach((child, index) => {
                                        args[index] = wrap(child, obj, visited);
                                    });
                                    let result;
                                    if (arrProp === 'push') {
                                        const idx = arr.length;
                                        result = Array.prototype.push.apply(arr, args);
                                        if (undoManager.isBatching) {
                                            for (let i = 0; i < args.length; i++) {
                                                undoManager.record({
                                                    type: 'add',
                                                    target: arr,
                                                    parent: obj,
                                                    index: idx + i,
                                                    objectSnapshot: args[i]
                                                });
                                            }
                                        }
                                    } else if (arrProp === 'splice') {
                                        const [start, deleteCount, ...items] = args;
                                        const removed = arr.slice(start, start + deleteCount);
                                        result = Array.prototype.splice.apply(arr, args as [number, number, ...any[]]);
                                        if (undoManager.isBatching) {
                                            removed.forEach((item, i) => {
                                                undoManager.record({
                                                    type: 'remove',
                                                    target: arr,
                                                    parent: obj,
                                                    index: start + i,
                                                    objectSnapshot: item
                                                });
                                            });
                                            items.forEach((item, i) => {
                                                undoManager.record({
                                                    type: 'add',
                                                    target: arr,
                                                    parent: obj,
                                                    index: start + i,
                                                    objectSnapshot: item
                                                });
                                            });
                                        }
                                    } else if (arrProp === 'unshift') {
                                        result = Array.prototype.unshift.apply(arr, args);
                                        if (undoManager.isBatching) {
                                            for (let i = 0; i < args.length; i++) {
                                                undoManager.record({
                                                    type: 'add',
                                                    target: arr,
                                                    parent: obj,
                                                    index: i,
                                                    objectSnapshot: args[i]
                                                });
                                            }
                                        }
                                    }
                                    return result;
                                };
                            }
                            return Reflect.get(arr, arrProp, arrReceiver);
                        }
                    });
                }
                // 递归代理所有 object 属性（排除 parent、__isProxy、__proto__ 等特殊属性）
                if (canProxy(value) &&
                    prop !== 'parent' &&
                    prop !== '__isProxy' &&
                    prop !== '__proto__'
                ) {
                    return wrap(value, obj, visited);
                }
                return value;
            },
            set(target, prop, value, receiver) {
                const oldValue = target[prop];
                const newValue =  canProxy(value) ? wrap(value, obj, visited) : value;
                if (undoManager.isBatching && oldValue !== value && prop !== 'parent' && prop !== '__isProxy') {
                    undoManager.record({
                        type: 'modify',
                        target: target,
                        property: prop as string,
                        oldValue,
                        newValue
                    });
                }
                const result = Reflect.set(target, prop, newValue, receiver);
                return result;
            }
        };
        const proxy = new Proxy(obj, handler);
        proxy.__isProxy = true;
        // 递归所有自身属性为 object 的属性
        for (const key of Object.keys(obj)) {
            if (key !== 'parent' &&
                key !== '__isProxy' &&
                key !== '__proto__' &&
                canProxy(obj[key])
            ) {
                proxy[key] = wrap(obj[key], proxy, visited);
            }
        }
        if (proxy.isKindOf && proxy.isKindOf("_XthObject")) {
            proxy.setProxy();
        }
        return proxy;
    }
    return wrap(scene);
}

export const sceneUndoManager = new UndoManager();
