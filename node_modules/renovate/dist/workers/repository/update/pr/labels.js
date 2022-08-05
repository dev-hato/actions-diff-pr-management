"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareLabels = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const template = tslib_1.__importStar(require("../../../../util/template"));
function prepareLabels(config) {
    const labels = config.labels ?? [];
    const addLabels = config.addLabels ?? [];
    return [...new Set([...labels, ...addLabels])]
        .filter(is_1.default.nonEmptyStringAndNotWhitespace)
        .map((label) => template.compile(label, config))
        .filter(is_1.default.nonEmptyStringAndNotWhitespace);
}
exports.prepareLabels = prepareLabels;
//# sourceMappingURL=labels.js.map