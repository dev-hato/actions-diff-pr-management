"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrHeader = void 0;
const tslib_1 = require("tslib");
const template = tslib_1.__importStar(require("../../../../../util/template"));
function getPrHeader(config) {
    if (!config.prHeader) {
        return '';
    }
    return template.compile(config.prHeader, config) + '\n\n';
}
exports.getPrHeader = getPrHeader;
//# sourceMappingURL=header.js.map