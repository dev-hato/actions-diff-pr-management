// LICENSE : MIT
"use strict";
import filter from "unist-util-filter";
import { splitAST, Syntax as SentenceSyntax } from "sentence-splitter";
import { StringSource } from "textlint-util-to-string"

function countOfComma(text) {
    return text.split(",").length - 1;
}

const defaultOptions = {
    // default: allowed command count
    max: 4
};
export default function (context, options = defaultOptions) {
    const maxComma = options.max || defaultOptions.max;
    const { Syntax, RuleError, report, getSource } = context;
    return {
        [Syntax.Paragraph](node) {
            const paragraphSentence = splitAST(node)
            // Remove Code node for avoiding false-positive in `CODE`
            const paragraphSentenceWithoutNode = filter(paragraphSentence, (node) => {
                return node.type !== Syntax.Code;
            });
            if (!paragraphSentenceWithoutNode) {
                return;
            }
            // This `sum(0,1,2,3,4,5,6,7,8,9,10)` is ok
            // → This  is ok
            const sentencesWithoutCode = paragraphSentenceWithoutNode
                ?.children
                ?.filter(node => node.type === SentenceSyntax.Sentence) ?? [];
            sentencesWithoutCode.forEach(sentence => {
                const source = new StringSource(sentence);
                const sentenceValue = source.toString();
                const count = countOfComma(sentenceValue);
                if (count > maxComma) {
                    const lastCommandIndex = sentenceValue.lastIndexOf(",");
                    report(node, new RuleError(`This sentence exceeds the maximum count of comma. Maximum is ${maxComma}.`, {
                        index: source.originalIndexFromIndex(lastCommandIndex)
                    }));
                }
            });
        }
    }
}
