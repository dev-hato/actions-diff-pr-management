// MIT © 2017 azu
"use strict";
import { tokenize } from "kuromojin";
import arrayFindIndex from "array-find-index";
import { createMatcher } from "morpheme-match-all";
import saInsertDict from "./dict/sa-insert-dict";
import saDroppingDict from "./dict/sa-dropping-dict";

const matchAll = createMatcher(saInsertDict.concat([
    saDroppingDict
]));
/**
 * 実際に一致してるtokenのindexを返す
 * 「さ」のtokenのindexを返すイメージ
 * 「さ」がない場合は先頭のindex
 * @param tokens
 * @param actualTokens
 * @returns {number}
 */
const findSaTokenIndex = (tokens, actualTokens) => {
    const saTokenIndex = arrayFindIndex(tokens, (token) => {
        return token.hasOwnProperty("_index");
    });
    // 無い場合は先頭を返す
    if (saTokenIndex === -1) {
        return actualTokens[0].word_position - 1;
    }
    // assert(saTokenIndex !== -1, "「さ」のtokenが見つかりません。Issueで報告してください。");
    const actualSaToken = actualTokens[saTokenIndex];
    return actualSaToken.word_position - 1;
};

const replaceWithCaptureTokens = (text, tokens, actualTokens) => {
    let resultText = text;
    tokens.forEach((token, index) => {
        // _captureがないのは無視
        if (!token._capture) {
            return;
        }
        const actualToken = actualTokens[index];
        resultText = resultText.replace(token._capture, actualToken.surface_form);
    });
    return resultText;
};
const reporter = (context) => {
    const { Syntax, RuleError, report, fixer, getSource } = context;
    return {
        [Syntax.Str](node) {
            const text = getSource(node);
            return tokenize(text).then(tokens => {
                const matchResults = matchAll(tokens);
                matchResults.forEach(matchResult => {
                    const firstToken = matchResult.tokens[0];
                    const lastToken = matchResult.tokens[matchResult.tokens.length - 1];
                    const firstWordIndex = Math.max(firstToken.word_position - 1, 0);
                    const lastWorkIndex = Math.max(lastToken.word_position - 1, 0);
                    const saTokenIndex = findSaTokenIndex(matchResult.dict.tokens, matchResult.tokens);
                    // replace $1
                    const message = replaceWithCaptureTokens(matchResult.dict.message, matchResult.dict.tokens, matchResult.tokens);
                    const expected = replaceWithCaptureTokens(matchResult.dict.expected, matchResult.dict.tokens, matchResult.tokens);
                    if (expected) {
                        report(node, new RuleError(message, {
                            index: saTokenIndex,
                            fix: fixer.replaceTextRange([
                                firstWordIndex, lastWorkIndex + lastToken.surface_form.length
                            ], expected)
                        }));
                    } else {
                        report(node, new RuleError(message, {
                            index: saTokenIndex
                        }));
                    }
                });
            });
        }
    }
};

export default {
    linter: reporter,
    fixer: reporter
};
