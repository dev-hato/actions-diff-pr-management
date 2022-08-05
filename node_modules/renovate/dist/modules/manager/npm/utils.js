"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeLockFile = exports.parseLockFile = void 0;
const tslib_1 = require("tslib");
const detect_indent_1 = tslib_1.__importDefault(require("detect-indent"));
const logger_1 = require("../../../logger");
function parseLockFile(lockFile) {
    const detectedIndent = (0, detect_indent_1.default)(lockFile).indent || '  ';
    let lockFileParsed;
    try {
        lockFileParsed = JSON.parse(lockFile);
    }
    catch (err) {
        logger_1.logger.warn({ err }, 'Error parsing npm lock file');
    }
    return { detectedIndent, lockFileParsed };
}
exports.parseLockFile = parseLockFile;
function composeLockFile(lockFile, indent) {
    return JSON.stringify(lockFile, null, indent) + '\n';
}
exports.composeLockFile = composeLockFile;
//# sourceMappingURL=utils.js.map