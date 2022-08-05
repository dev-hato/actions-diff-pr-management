"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVersion = exports.api = exports.isValid = exports.supportedRangeStrategies = exports.supportsRanges = exports.urls = exports.displayName = exports.id = void 0;
const regex_1 = require("../../../util/regex");
const npm_1 = require("../npm");
exports.id = 'hashicorp';
exports.displayName = 'Hashicorp';
exports.urls = [
    'https://www.terraform.io/docs/configuration/terraform.html#specifying-a-required-terraform-version',
];
exports.supportsRanges = true;
exports.supportedRangeStrategies = [
    'bump',
    'widen',
    'pin',
    'replace',
];
function hashicorp2npm(input) {
    // The only case incompatible with semver is a "short" ~>, e.g. ~> 1.2
    return input.replace((0, regex_1.regEx)(/~>(\s*\d+\.\d+$)/), '^$1').replace(',', '');
}
function isLessThanRange(version, range) {
    return !!npm_1.api.isLessThanRange?.(hashicorp2npm(version), hashicorp2npm(range));
}
const isValid = (input) => !!input && npm_1.api.isValid(hashicorp2npm(input));
exports.isValid = isValid;
const matches = (version, range) => npm_1.api.matches(hashicorp2npm(version), hashicorp2npm(range));
function getSatisfyingVersion(versions, range) {
    return npm_1.api.getSatisfyingVersion(versions.map(hashicorp2npm), hashicorp2npm(range));
}
function minSatisfyingVersion(versions, range) {
    return npm_1.api.minSatisfyingVersion(versions.map(hashicorp2npm), hashicorp2npm(range));
}
function getNewValue({ currentValue, rangeStrategy, currentVersion, newVersion, }) {
    if (['replace', 'update-lockfile'].includes(rangeStrategy)) {
        const minor = npm_1.api.getMinor(newVersion);
        const major = npm_1.api.getMajor(newVersion);
        if ((0, regex_1.regEx)(/~>\s*0\.\d+/).test(currentValue) && major === 0 && minor) {
            const testFullVersion = (0, regex_1.regEx)(/(~>\s*0\.)(\d+)\.\d$/);
            let replaceValue = '';
            if (testFullVersion.test(currentValue)) {
                replaceValue = `$<prefix>${minor}.0`;
            }
            else {
                replaceValue = `$<prefix>${minor}$<suffix>`;
            }
            return currentValue.replace((0, regex_1.regEx)(`(?<prefix>~>\\s*0\\.)\\d+(?<suffix>.*)$`), replaceValue);
        }
        // handle special ~> 1.2 case
        if (major && (0, regex_1.regEx)(/(~>\s*)\d+\.\d+$/).test(currentValue)) {
            return currentValue.replace((0, regex_1.regEx)(`(?<prefix>~>\\s*)\\d+\\.\\d+$`), `$<prefix>${major}.0`);
        }
    }
    return npm_1.api.getNewValue({
        currentValue,
        rangeStrategy,
        currentVersion,
        newVersion,
    });
}
exports.api = {
    ...npm_1.api,
    isLessThanRange,
    isValid: exports.isValid,
    matches,
    getSatisfyingVersion,
    minSatisfyingVersion,
    getNewValue,
};
// eslint-disable-next-line @typescript-eslint/unbound-method
exports.isVersion = exports.api.isVersion;
exports.default = exports.api;
//# sourceMappingURL=index.js.map