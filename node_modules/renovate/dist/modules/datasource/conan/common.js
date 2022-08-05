"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conanDatasourceRegex = exports.datasource = exports.defaultRegistryUrl = void 0;
const regex_1 = require("../../../util/regex");
exports.defaultRegistryUrl = 'https://center.conan.io/';
exports.datasource = 'conan';
exports.conanDatasourceRegex = (0, regex_1.regEx)(/(?<name>[a-z\-_0-9]+)\/(?<version>[^@/\n]+)(?<userChannel>@\S+\/\S+)/, 'gim');
//# sourceMappingURL=common.js.map