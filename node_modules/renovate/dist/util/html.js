"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const tslib_1 = require("tslib");
const node_html_parser_1 = tslib_1.__importDefault(require("node-html-parser"));
function parse(html, config) {
    if (typeof config !== 'undefined') {
        return (0, node_html_parser_1.default)(html, config);
    }
    return (0, node_html_parser_1.default)(html);
}
exports.parse = parse;
//# sourceMappingURL=html.js.map