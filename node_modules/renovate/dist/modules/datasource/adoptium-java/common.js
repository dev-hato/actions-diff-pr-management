"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageType = exports.datasource = exports.defaultRegistryUrl = exports.pageSize = void 0;
// Api page size limit 50
exports.pageSize = 50;
exports.defaultRegistryUrl = 'https://api.adoptium.net/';
exports.datasource = 'adoptium-java';
function getImageType(packageName) {
    switch (packageName) {
        case 'java-jre':
            return 'jre';
        default:
            return 'jdk';
    }
}
exports.getImageType = getImageType;
//# sourceMappingURL=common.js.map