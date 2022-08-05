"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidRev12 = exports.isValidRev11 = exports.isValidRev10 = exports.CACHE_REVISION = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
// Increment this whenever there could be incompatibilities between old and new cache structure
exports.CACHE_REVISION = 12;
function isValidRev10(input, repo) {
    return (is_1.default.plainObject(input) &&
        is_1.default.safeInteger(input.revision) &&
        input.revision === 10 &&
        is_1.default.string(input.repository) &&
        (!repo || repo === input.repository));
}
exports.isValidRev10 = isValidRev10;
function isValidRev11(input, repo) {
    return (is_1.default.plainObject(input) &&
        is_1.default.safeInteger(input.revision) &&
        input.revision === 11 &&
        is_1.default.string(input.repository) &&
        is_1.default.plainObject(input.data) &&
        (!repo || repo === input.repository));
}
exports.isValidRev11 = isValidRev11;
function isValidRev12(input, repo) {
    return (is_1.default.plainObject(input) &&
        is_1.default.safeInteger(input.revision) &&
        input.revision === exports.CACHE_REVISION &&
        is_1.default.string(input.repository) &&
        (!repo || repo === input.repository) &&
        is_1.default.string(input.payload) &&
        is_1.default.string(input.hash));
}
exports.isValidRev12 = isValidRev12;
//# sourceMappingURL=common.js.map