import { splitAST, Syntax as SentenceSyntax } from "sentence-splitter";
import { StringSource } from "textlint-util-to-string";
import { RuleHelper } from "textlint-rule-helper";
import { createRegExp } from "@textlint/regexp-string-matcher";
import { TextlintRuleReporter } from "@textlint/types";
import { TxtNode, TxtParentNode } from "@textlint/ast-node-types";

function removeRangeFromString(text: string, regExpStrings: string[]) {
    const patterns = regExpStrings.map((pattern) => {
        return createRegExp(pattern);
    });
    let result = text;
    patterns.forEach((pattern) => {
        result = result.replace(pattern, "");
    });
    return result;
}

export type Options = {
    max?: number;
    /**
     * The strings that match following patterns is un-count of the sentence
     * See https://github.com/textlint/regexp-string-matcher
     */
    skipPatterns?: string[];
    /**
     * If it is true, skip the count of following link node.
     *
     * [https://example.com](https://example.com)
     * <https://example.com>
     *
     * UrlStringLink is has the title which is same of href.
     */
    skipUrlStringLink?: boolean;
    /**
     * @deprecated use skipPatterns
     */
    exclusionPatterns?: string[];
};
const defaultOptions: Required<Options> = {
    max: 100,
    skipPatterns: [],
    skipUrlStringLink: true,
    /**
     * @deprecated
     */
    exclusionPatterns: []
};

const reporter: TextlintRuleReporter<Options> = (context, options = {}) => {
    const maxLength = options.max ?? defaultOptions.max;
    const skipPatterns = options.skipPatterns ?? options.exclusionPatterns ?? defaultOptions.skipPatterns;
    const skipUrlStringLink = options.skipUrlStringLink ?? defaultOptions.skipUrlStringLink;
    const helper = new RuleHelper(context);
    const { Syntax, RuleError, report } = context;
    const isUrlStringLink = (node: TxtNode | TxtParentNode): boolean => {
        if (node.type !== Syntax.Link) {
            return false;
        }
        const linkNode = node as TxtParentNode;
        const nodeText = new StringSource(linkNode).toString();
        return node.url === nodeText;
    };

    // toPlainText
    return {
        [Syntax.Paragraph](node) {
            if (helper.isChildNode(node, [Syntax.BlockQuote])) {
                return;
            }
            // If a single Link node in the paragraph node, should be ignore the link length
            const isChildrenSingleLinkNode = node.children.length === 1 && node.children[0].type === Syntax.Link;
            if (isChildrenSingleLinkNode) {
                return;
            }
            // empty break line == split sentence
            const paragraph = splitAST(node);
            paragraph.children
                .filter((sentence) => sentence.type === SentenceSyntax.Sentence)
                .forEach((sentence) => {
                    const filteredSentence = skipUrlStringLink
                        ? {
                              ...sentence,
                              children: sentence.children.filter((sentenceChildNode: TxtNode | TxtParentNode) => {
                                  return !isUrlStringLink(sentenceChildNode);
                              })
                          }
                        : sentence;
                    // @ts-expect-error: wrong types
                    const source = new StringSource(filteredSentence);
                    const actualText = source.toString();
                    const sentenceText = removeRangeFromString(actualText, skipPatterns);
                    // larger than > 100
                    const actualTextLength = actualText.length;
                    const sentenceLength = sentenceText.length;
                    if (sentenceLength > maxLength) {
                        const startLine = filteredSentence.loc.start.line;
                        report(
                            filteredSentence,
                            new RuleError(`Line ${startLine} sentence length(${
                                sentenceLength !== actualTextLength
                                    ? `${sentenceLength}, original:${actualTextLength}`
                                    : sentenceLength
                            }) exceeds the maximum sentence length of ${maxLength}.
Over ${sentenceLength - maxLength} characters.`)
                        );
                    }
                });
        }
    };
};
export default reporter;
