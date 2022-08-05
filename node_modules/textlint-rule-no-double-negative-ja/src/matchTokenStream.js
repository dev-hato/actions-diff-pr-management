// LICENSE : MIT
"use strict";

/**
 * expectShape
 * [expectShape | expectShape]
 * にどれかにマッチするならtrueを返す
 * @param {*} token
 * @param {*|*[]} expectShape
 *  orでマッチしたい場合は配列を渡す
 * @returns {boolean}
 */
function matchToken(token, expectShape) {
    if (Array.isArray(expectShape)) {
        return expectShape.some(singleExpectShape => matchToken(token, singleExpectShape));
    }
    return Object.keys(expectShape).every(key => {
        const actualValue = token[key];
        // 値は複数の場合もある
        const expectedValues = Array.isArray(expectShape[key]) ? expectShape[key] : [expectShape[key]];
        return expectedValues.some(expectedValue => {
            return actualValue === expectedValue;
        });
    })
}

export default function expectTokenStream(tokenStream) {
    let currentTokenPosition = 0;
    const tokenCount = tokenStream.length;
    return (token) => {
        const expectedToken = tokenStream[currentTokenPosition];
        if (matchToken(token, expectedToken)) {
            currentTokenPosition += 1;
        } else {
            // restart
            currentTokenPosition = 0;
        }
        // match
        if (currentTokenPosition === tokenCount) {
            // match -> reset
            currentTokenPosition = 0;
            return true;
        }
        return false;
    }
}
