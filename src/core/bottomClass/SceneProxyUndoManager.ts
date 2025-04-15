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
    undo() {
        const batch = this.undoStack.pop();
        if (!batch) return;
        for (let i = batch.length - 1; i >= 0; i--) {
            const c = batch[i];
            if (c.type === 'add') {
                c.parent.children.splice(c.index!, 1);
            } else if (c.type === 'remove') {
                c.parent.children.splice(c.index!, 0, c.objectSnapshot);
                c.objectSnapshot.parent = c.parent;
            } else if (c.type === 'modify') {
                c.target[c.property!] = c.oldValue;
            }
        }
        this.redoStack.push(batch);
    }
    redo() {
        const batch = this.redoStack.pop();
        if (!batch) return;
        for (const c of batch) {
            if (c.type === 'add') {
                c.parent.children.splice(c.index!, 0, c.objectSnapshot);
                c.objectSnapshot.parent = c.parent;
            } else if (c.type === 'remove') {
                c.parent.children.splice(c.index!, 1);
            } else if (c.type === 'modify') {
                c.target[c.property!] = c.newValue;
            }
        }
        this.undoStack.push(batch);
    }
}

export function createSceneProxy(scene: any, undoManager: UndoManager): any {
    function wrap(obj: any, parent?: any) {
        if (obj && typeof obj === 'object' && !obj.__isProxy) {
            const handler: ProxyHandler<any> = {
                get(target, prop, receiver) {
                    const value = Reflect.get(target, prop, receiver);
                    if (prop === 'children' && Array.isArray(value)) {
                        return new Proxy(value, {
                            get(arr, arrProp, arrReceiver) {
                                if (['push', 'splice', 'unshift'].includes(arrProp as string)) {
                                    return function (...args: any[]) {
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
                                            args.forEach(child => wrap(child, obj));
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
                                            items.forEach(child => wrap(child, obj));
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
                                            args.forEach(child => wrap(child, obj));
                                        }
                                        return result;
                                    };
                                }
                                return Reflect.get(arr, arrProp, arrReceiver);
                            }
                        });
                    }
                    if (typeof value === 'object' && value !== null && !value.__isProxy) {
                        return wrap(value, obj);
                    }
                    return value;
                },
                set(target, prop, value, receiver) {
                    const oldValue = target[prop];
                    const result = Reflect.set(target, prop, value, receiver);
                    if (undoManager.isBatching && oldValue !== value && prop !== 'parent') {
                        undoManager.record({
                            type: 'modify',
                            target: target,
                            property: prop as string,
                            oldValue,
                            newValue: value
                        });
                    }
                    if (typeof value === 'object' && value !== null) {
                        wrap(value, obj);
                    }
                    return result;
                }
            };
            const proxy = new Proxy(obj, handler);
            proxy.__isProxy = true;
            if (Array.isArray(obj.children)) {
                obj.children.forEach((child: any) => wrap(child, proxy));
            }
            return proxy;
        }
        return obj;
    }
    return wrap(scene);
}

export const sceneUndoManager = new UndoManager();
