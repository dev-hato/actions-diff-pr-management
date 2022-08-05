"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.massageMarkdownLinks = void 0;
const tslib_1 = require("tslib");
const remark_1 = tslib_1.__importDefault(require("remark"));
const logger_1 = require("../../../logger");
const object_1 = require("../../../util/object");
const regex_1 = require("../../../util/regex");
const urlRegex = /(?:https?:)?(?:\/\/)?(?:www\.)?(?<!api\.)(?:to)?github\.com\/[-_a-z0-9]+\/[-_a-z0-9]+\/(?:discussions|issues|pull)\/[0-9]+(?:#[-_a-z0-9]+)?/i; // TODO #12872 (?<!re) after text not matching
function massageLink(input) {
    return input.replace((0, regex_1.regEx)(/(?:to)?github\.com/i), 'togithub.com');
}
function collectLinkPosition(input, matches) {
    const transformer = (tree) => {
        const startOffset = tree.position?.start.offset ?? 0;
        const endOffset = tree.position?.end.offset ?? 0;
        if (tree.type === 'link') {
            const substr = input.slice(startOffset, endOffset);
            const url = tree.url;
            const offset = startOffset + substr.lastIndexOf(url);
            if (urlRegex.test(url)) {
                matches.push({
                    start: offset,
                    end: offset + url.length,
                    replaceTo: massageLink(url),
                });
            }
        }
        else if (tree.type === 'text') {
            const globalUrlReg = new RegExp(urlRegex, 'gi');
            const urlMatches = [...tree.value.matchAll(globalUrlReg)];
            for (const match of urlMatches) {
                const [url] = match;
                const start = startOffset + (match.index ?? 0);
                const end = start + url.length;
                const newUrl = massageLink(url);
                matches.push({ start, end, replaceTo: `[${url}](${newUrl})` });
            }
        }
        else if ((0, object_1.hasKey)('children', tree)) {
            tree.children.forEach((child) => {
                transformer(child);
            });
        }
    };
    return () => transformer;
}
function massageMarkdownLinks(content) {
    try {
        const rightSpaces = content.replace(content.trimEnd(), '');
        const matches = [];
        (0, remark_1.default)().use(collectLinkPosition(content, matches)).processSync(content);
        const result = matches.reduceRight((acc, { start, end, replaceTo }) => {
            const leftPart = acc.slice(0, start);
            const rightPart = acc.slice(end);
            return leftPart + replaceTo + rightPart;
        }, content);
        return result.trimEnd() + rightSpaces;
    }
    catch (err) /* istanbul ignore next */ {
        logger_1.logger.warn({ err }, `Unable to massage markdown text`);
        return content;
    }
}
exports.massageMarkdownLinks = massageMarkdownLinks;
//# sourceMappingURL=massage-markdown-links.js.map