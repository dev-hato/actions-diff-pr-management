import type { TxtNode, TxtParentNode } from "@textlint/ast-node-types";
import StructuredSource, { SourcePosition } from "structured-source";
import type { Node as UnistNode } from "unist"
import unified from "unified";
// @ts-ignore
import parse from "rehype-parse";

const isTxtNode = (node: unknown): node is TxtNode => {
    return typeof node === "object" && node !== null && "range" in node;
}

const html2hast = (html: string) => {
    return unified()
        .use(parse, {fragment: true})
        .parse(html);
};

/* StringSourceIR example
 Example: **Str**
 {
 // original range
 // [0, 7] = `**Str**`
 original : [start, end]
 // intermediate = trim decoration from Original
 // [2, 5]
 intermediate: [start, end]
 // (generated) value
 generatedValue: "Str"
 // [0, 3]
 generated : [start, end]
 }
 */

type StringSourceIR = {
    original: readonly [number, number];
    intermediate: readonly [number, number];
    generatedValue: string;
    generated?: [number, number];
};
export default class StringSource {
    private rootNode: TxtParentNode;
    private generatedString: string;
    private originalSource: StructuredSource;
    private generatedSource: StructuredSource;
    private tokenMaps: StringSourceIR[];

    constructor(node: TxtParentNode) {
        this.rootNode = node;
        this.tokenMaps = [];
        this.generatedString = "";
        // pre calculate
        this._stringify(this.rootNode);
        this.originalSource = new StructuredSource(this.rootNode.raw);
        this.generatedSource = new StructuredSource(this.generatedString);
    }

    toString() {
        return this.generatedString;
    }

    /**
     * @deprecated use originalIndexFromIndex instead of
     * @param targetIndex
     */
    originalIndexFor(targetIndex: number): number | undefined {
        return this.originalIndexFromIndex(targetIndex);
    }

    /**
     * @deprecated use originalPositionFromPosition instead of
     * @param generatedPosition
     * @param {boolean}  isEnd - is the position end of the node?

     * @returns {Object}
     */
    originalPositionFor(generatedPosition: SourcePosition, isEnd = false): SourcePosition | undefined {
        return this.originalPositionFromPosition(generatedPosition, isEnd);
    }

    /**
     * get original index from generated index value
     * @param {number} generatedIndex - position is a index value.
     * @param {boolean}  isEnd - is the position end of the node?
     * @returns {number|undefined} original
     */
    originalIndexFromIndex(generatedIndex: number, isEnd = false) {
        const hitTokenMaps = this.tokenMaps.filter((tokenMap, index) => {
            const generated = tokenMap.generated;
            const nextTokenMap = this.tokenMaps[index + 1];
            const nextGenerated = nextTokenMap ? nextTokenMap.generated : null;
            if (!generated) {
                return false;
            }
            if (nextGenerated) {
                if (generated[0] <= generatedIndex && generatedIndex <= nextGenerated[0]) {
                    return true;
                }
            } else {
                if (generated[0] <= generatedIndex && generatedIndex <= generated[1]) {
                    return true;
                }
            }
            return false;
        });
        if (hitTokenMaps.length === 0) {
            return;
        }

        /**
         * **Str**ABC
         *     |
         *     |
         *   generatedIndex
         *
         * If isEnd is true, generatedIndex is end of **Str** node.
         * If isEnd is false, generatedIndex is index of ABC node.
         */

        const hitTokenMap = isEnd ? hitTokenMaps[0] : hitTokenMaps[hitTokenMaps.length - 1];
        // <----------->[<------------->|text]
        //              ^        ^
        //   position-generated  intermediate-origin

        // <-------------->[<------------->|text]
        //       |         |
        //  outer adjust   _
        //            inner adjust = 1

        if (!hitTokenMap.generated) {
            console.warn("hitTokenMap.generated is missing", hitTokenMap);
            return;
        }
        const outerAdjust = generatedIndex - hitTokenMap.generated[0];
        const innerAdjust = hitTokenMap.intermediate[0] - hitTokenMap.original[0];
        return outerAdjust + innerAdjust + hitTokenMap.original[0];
    }

    /**
     * get original position from generated position
     * @param {object} position
     * @param {boolean}  isEnd - is the position end of the node?
     * @returns {object} original position
     */
    originalPositionFromPosition(position: SourcePosition, isEnd = false): SourcePosition | undefined {
        if (typeof position.line === "undefined" || typeof position.column === "undefined") {
            throw new Error("position.{line, column} should not undefined: " + JSON.stringify(position));
        }
        const generatedIndex = this.generatedSource.positionToIndex(position);
        if (isNaN(generatedIndex)) {
            // Not Found
            return;
        }
        const originalIndex = this.originalIndexFromIndex(generatedIndex, isEnd);
        if (originalIndex === undefined) {
            return;
        }
        return this.originalSource.indexToPosition(originalIndex);
    }

    /**
     * get original index from generated position
     * @param {object} generatedPosition
     * @param {boolean}  isEnd - is the position end of the node?
     * @returns {number} original index
     */
    originalIndexFromPosition(generatedPosition: SourcePosition, isEnd = false): number | undefined {
        const originalPosition = this.originalPositionFromPosition(generatedPosition, isEnd);
        if (originalPosition === undefined) {
            return;
        }
        return this.originalSource.positionToIndex(originalPosition);
    }

    /**
     * get original position from generated index
     * @param {number} generatedIndex
     * @param {boolean} isEnd - is the position end of the node?
     * @return {object} original position
     */
    originalPositionFromIndex(generatedIndex: number, isEnd = false): SourcePosition | undefined {
        const originalIndex = this.originalIndexFromIndex(generatedIndex, isEnd);
        if (originalIndex === undefined) {
            return;
        }
        return this.originalSource.indexToPosition(originalIndex);
    }

    isParagraphNode(node: TxtNode): boolean {
        return node.type === "Paragraph";
    }

    isStringNode(node: TxtNode | UnistNode): boolean {
        return node.type === "Str";
    }

    /**
     *
     * @param node
     * @returns {string|undefined}
     * @private
     */
    private _getValue(node: TxtNode | UnistNode): string | undefined {
        if (node.value) {
            return node.value;
        } else if (node.alt) {
            return node.alt;
        } else if (node.title) {
            // See https://github.com/azu/textlint-rule-sentence-length/issues/6
            if (node.type === "Link") {
                return;
            }
            return node.title;
        } else {
            return;
        }
    }

    private _nodeRangeAsRelative(node: TxtNode | UnistNode): [number, number] {
        if (isTxtNode(node)) {
            // relative from root
            return [node.range[0] - this.rootNode.range[0], node.range[1] - this.rootNode.range[0]];
        } else {
            return [
                (node.position?.start?.offset ?? 0) - this.rootNode.range[0],
                (node.position?.end?.offset ?? 0) - this.rootNode.range[0]
            ]
        }
    }

    private _valueOf(node: TxtNode | UnistNode, parent?: TxtParentNode): StringSourceIR | undefined {
        if (!node) {
            return;
        }

        // [padding][value][padding]
        // =>
        // [value][value][value]
        const value = this._getValue(node);
        if (!value) {
            return;
        }
        if (parent === null || parent === undefined) {
            return;
        }
        // <p><Str /></p>
        if (this.isParagraphNode(parent) && this.isStringNode(node)) {
            return {
                original: this._nodeRangeAsRelative(node),
                intermediate: this._nodeRangeAsRelative(node),
                generatedValue: value
            };
        }
        // <p><code>code</code></p>
        // => container is <p>
        // <p><strong><Str /></strong></p>
        // => container is <strong>
        const container = this.isParagraphNode(parent) ? node : parent;
        const rawValue = container.raw as string | undefined;
        if (rawValue === undefined) {
            return
        }
        // avoid match ! with ![
        // TODO: indexOf(value, 1) 1 is unexpected ...
        const paddingLeft = rawValue.indexOf(value, 1) === -1 ? 0 : rawValue.indexOf(value, 1);
        const paddingRight = rawValue.length - (paddingLeft + value.length);
        // original range should be relative value from rootNode
        const originalRange = this._nodeRangeAsRelative(container);
        const intermediateRange = [originalRange[0] + paddingLeft, originalRange[1] - paddingRight] as const;
        return {
            original: originalRange,
            intermediate: intermediateRange,
            generatedValue: value
        };
    }

    private _addTokenMap(tokenMap: StringSourceIR) {
        if (tokenMap == null) {
            return;
        }
        let addedTokenMap = Object.assign({}, tokenMap);
        if (this.tokenMaps.length === 0) {
            let textLength = addedTokenMap.intermediate[1] - addedTokenMap.intermediate[0];
            addedTokenMap["generated"] = [0, textLength];
        } else {
            let textLength = addedTokenMap.intermediate[1] - addedTokenMap.intermediate[0];
            addedTokenMap["generated"] = [this.generatedString.length, this.generatedString.length + textLength];
        }
        this.generatedString += tokenMap.generatedValue;
        this.tokenMaps.push(addedTokenMap);
    }

    /**
     * Compute text content of a node.  If the node itself
     * does not expose plain-text fields, `toString` will
     * recursively mapping
     *
     * @param {Node} node - Node to transform to a string.
     * @param {Node} [parent] - Parent Node of the `node`.
     */
    private _stringify(node: TxtNode | TxtParentNode, parent?: TxtParentNode): void | StringSourceIR {
        const isHTML = node.type === "Html";
        const currentNode = isHTML ? html2hast(node.value) : node;
        const value = this._valueOf(currentNode, parent);
        if (value) {
            return value;
        }
        if (!isParentNode(node)) {
            return;
        }
        currentNode.children.forEach((childNode: TxtNode) => {
            if (!isParentNode(node)) {
                return;
            }
            const tokenMap = this._stringify(childNode, node);
            if (tokenMap) {
                this._addTokenMap(tokenMap);
            }
        });
    }
}

const isParentNode = (node: TxtNode | TxtParentNode): node is TxtParentNode => {
    return "children" in node;
};
