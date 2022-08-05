// MIT © 2018 azu
"use strict";

export class SourceCode {
    constructor(text) {
        this.text = text;
        this.index = 0;
        /** @type {{index:number, pairMark: PairMark}}[] */
        this.contextLocations = [];
    }

    enterContext(pairMark) {
        this.contextLocations.push({
            index: this.index + 1,
            pairMark
        });
    }

    leaveContext(pairMark) {
        const index = this.contextLocations.findIndex(context => {
            return context.pairMark.key === pairMark.key;
        });
        if (index !== -1) {
            this.contextLocations.splice(index, 1);
        }
    }

    isInContext(pairMark) {
        if (!pairMark) {
            return this.contextLocations.length > 0;
        }
        return this.contextLocations.some(contextLocation => contextLocation.pairMark.key === pairMark.key);
    }

    /**
     * Return true, no more read char
     */
    get canRead() {
        return this.read() !== undefined;
    }

    read() {
        return this.text[this.index];
    }

    peek(index = 1) {
        this.index += index;
    }
}
