"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGetPkgReleasesConfig = void 0;
function isGetPkgReleasesConfig(input) {
    return (input.datasource !== undefined &&
        input.depName !== undefined);
}
exports.isGetPkgReleasesConfig = isGetPkgReleasesConfig;
//# sourceMappingURL=common.js.map