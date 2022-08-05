"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.supportsRanges = exports.urls = exports.displayName = exports.id = void 0;
const tslib_1 = require("tslib");
const semver_1 = tslib_1.__importDefault(require("semver"));
const regex_1 = require("../../../util/regex");
const generic_1 = require("../generic");
exports.id = 'nuget';
exports.displayName = 'NuGet';
exports.urls = [
    'https://docs.microsoft.com/en-us/nuget/concepts/package-versioning',
];
exports.supportsRanges = false;
const pattern = (0, regex_1.regEx)(/^(\d+(?:\.\d+)*)(-[^+]+)?(\+.*)?$/);
class NugetVersioningApi extends generic_1.GenericVersioningApi {
    _parse(version) {
        const matches = pattern.exec(version);
        if (!matches) {
            return null;
        }
        const [, prefix, prerelease] = matches;
        const release = prefix.split('.').map(Number);
        return { release, prerelease: prerelease || '' };
    }
    _compare(version, other) {
        const parsed1 = semver_1.default.parse(version);
        const parsed2 = semver_1.default.parse(other);
        if (!(parsed1 && parsed2)) {
            return super._compare(version, other);
        }
        return parsed1.compare(parsed2);
    }
}
exports.api = new NugetVersioningApi();
exports.default = exports.api;
//# sourceMappingURL=index.js.map