"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleSize = void 0;
function sampleSize(array, n) {
    const length = array ? array.length : 0;
    if (!length || n < 1) {
        return [];
    }
    const sampleNumber = n > length ? length : n;
    let index = 0;
    const lastIndex = length - 1;
    const result = [...array];
    while (index < sampleNumber) {
        const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
        [result[rand], result[index]] = [result[index], result[rand]];
        index += 1;
    }
    return result.slice(0, sampleNumber);
}
exports.sampleSize = sampleSize;
//# sourceMappingURL=index.js.map