import * as THREE from 'three';
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
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.setParent(undefined);
        }
    }

    remove(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}