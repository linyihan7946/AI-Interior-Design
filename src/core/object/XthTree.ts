/*
 * @Author: LinYiHan
 * @Date: 2025-03-04 15:57:08
 * @Description: 
 * @Version: 1.0
 */

import { JsonProperty } from '../bottomClass/Decorator';

export class XthTree {
    @JsonProperty(false)
    children: XthTree[] = [];

    @JsonProperty(false)
    parent: XthTree | undefined;

    setParent(parent: XthTree | undefined): void {
        this.parent = parent;
    }

    addChild(child: XthTree): void {
        this.children.push(child);
        child.setParent(this);
    }

    removeChild(child: XthTree): void {
        // 查找子节点在子节点数组中的索引
        const index = this.children.indexOf(child);

        // 如果找到了子节点
        if (index !== -1) {
            // 从子节点数组中移除子节点
            this.children.splice(index, 1);
            child.setParent(undefined);

            // 将子节点的父节点设置为 undefined
            child.setParent(undefined);
        }
    }

    remove(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}