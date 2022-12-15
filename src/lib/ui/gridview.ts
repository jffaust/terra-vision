import type { Rect, View, VizTypes } from '$lib/types';
import { copyRegion, isIdenticalRegion } from '$lib/utils';

export type Direction = "Horizontal" | "Vertical";
export type GridViewNode = SplitNode | View;
export interface SplitNode {
    region: Rect
    direction: Direction,
    children: GridViewNode[]
}

export class GridView {
    root: GridViewNode;

    constructor(initialViz: VizTypes) {
        this.root = {
            id: crypto.randomUUID(),
            type: initialViz,
            region: {
                left: 0,
                top: 0,
                width: 1,
                height: 1
            }
        }
    }

    split(viewId: string, dir: Direction) {
        if (isView(this.root)) {
            if (this.root.id == viewId) {
                this.root = splitViewAcross(this.root, dir);
            }
        } else {
            const result = locateView(this.root, viewId);
            if (result) {
                const [parent, view, index] = result;
                if (parent.direction == dir) {
                    parent.children.splice(index + 1, 0, {
                        id: crypto.randomUUID(),
                        type: view.type,
                        region: copyRegion(view.region)
                    })
                } else {
                    parent.children[index] = splitViewAcross(view, dir)
                }
            }
        }

        this.distribute();
    }

    remove(viewId: string) {
        if (!isView(this.root)) {
            const result = locateView(this.root, viewId);
            if (result) {
                const [parent, view, index] = result;
                if (parent.children.length > 2) {
                    parent.children.splice(index, 1);
                } else {
                    const remaining = index == 0 ? parent.children[1] : parent.children[0];
                    //remaining.region = copyRegion(parent.region);

                    // There's only 2 child and we're removing one so we need to replace the
                    // split node by the remaining child node

                    if (isIdenticalRegion(this.root.region, parent.region)) {
                        // replace the root node if we only have 1 remaining view in total
                        this.root = remaining;
                    } else {
                        const grandParentResult = locateSplitNodeParent(this.root, parent.region)
                        if (grandParentResult) {
                            const [grandParent, parentIndex] = grandParentResult;

                            grandParent.children.splice(parentIndex, 1, remaining);
                        }
                    }
                }
            }
            this.distribute();
        }
    }

    changeView(viewId: string, type: VizTypes) {
        if (isView(this.root)) {
            if (this.root.id === viewId) {
                this.root.type = type;
            }
        } else {
            const result = locateView(this.root, viewId);
            if (result) {
                const [parent, view, index] = result;
                view.type = type;
            }
        }
    }

    distribute() {
        if (isView(this.root)) {
            this.root.region = {
                left: 0,
                top: 0,
                width: 1,
                height: 1
            }
        } else {
            distributeFrom(this.root)
        }
    }

    getViews() {
        return getViewsFrom(this.root);
    }
}

function isView(node: GridViewNode): node is View {
    return ('id' in node && 'type' in node);
}

function splitViewAcross(v: View, dir: Direction): SplitNode {
    return {
        region: copyRegion(v.region),
        direction: dir,
        children: [
            v,
            {
                id: crypto.randomUUID(),
                type: v.type,
                region: copyRegion(v.region)
            }
        ]
    }
}

function locateSplitNodeParent(parent: SplitNode, region: Rect): [SplitNode, number] | null {

    for (let i = 0; i < parent.children.length; i++) {
        const node = parent.children[i];
        if (!isView(node)) {
            if (isIdenticalRegion(node.region, region)) {
                return [parent, i];
            } else {
                const result = locateSplitNodeParent(node, region);
                if (result) return result;
            }
        }
    }
    return null;
}

function locateView(parent: SplitNode, viewId: string): [SplitNode, View, number] | null {
    for (let i = 0; i < parent.children.length; i++) {
        const node = parent.children[i];
        if (isView(node)) {
            if (node.id === viewId) {
                return [parent, node, i];
            }
        }
        else {
            const result = locateView(node, viewId);
            if (result) return result;
        }
    }

    return null;
}

function getViewsFrom(node: GridViewNode): View[] {
    const views: View[] = [];

    if (isView(node)) {
        views.push(node);
    } else {
        node.children.forEach(n => {
            views.push(...getViewsFrom(n));
        });
    }

    return views;
}

function distributeFrom(split: SplitNode) {
    for (let i = 0; i < split.children.length; i++) {
        const node = split.children[i];

        if (split.direction == "Horizontal") {
            const splitWidth = split.region.width / split.children.length;
            node.region = {
                left: split.region.left + i * splitWidth,
                top: split.region.top,
                width: splitWidth,
                height: split.region.height
            }
        } else {
            const splitHeight = split.region.height / split.children.length;
            node.region = {
                left: split.region.left,
                top: split.region.top + i * splitHeight,
                width: split.region.width,
                height: splitHeight
            }
        }

        if (!isView(node)) {
            distributeFrom(node)
        }
    }
}