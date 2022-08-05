"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrFooter = void 0;
const tslib_1 = require("tslib");
const template = tslib_1.__importStar(require("../../../../../util/template"));
function getPrFooter(config) {
    if (config.prFooter) {
        return '\n---\n\n' + template.compile(config.prFooter, config);
    }
    return '';
}
exports.getPrFooter = getPrFooter;
//# sourceMappingURL=footer.js.map