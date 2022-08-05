"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSystemManifest = exports.systemManifestRegex = void 0;
const regex_1 = require("../../../util/regex");
exports.systemManifestRegex = '(^|/)flux-system/gotk-components\\.yaml$';
function isSystemManifest(file) {
    return (0, regex_1.regEx)(exports.systemManifestRegex).test(file);
}
exports.isSystemManifest = isSystemManifest;
//# sourceMappingURL=common.js.map