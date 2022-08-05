"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.isValid = exports.supportedRangeStrategies = exports.supportsRanges = exports.urls = exports.displayName = exports.id = void 0;
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const npm_1 = require("../npm");
exports.id = 'cargo';
exports.displayName = 'Cargo';
exports.urls = [
    'https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html',
];
exports.supportsRanges = true;
exports.supportedRangeStrategies = [
    'bump',
    'widen',
    'pin',
    'replace',
];
const isVersion = (input) => npm_1.api.isVersion(input);
function convertToCaret(item) {
    // In Cargo, "1.2.3" doesn't mean exactly 1.2.3, it means >= 1.2.3 < 2.0.0
    if (isVersion(item)) {
        // NOTE: Partial versions like '1.2' don't get converted to '^1.2'
        // because isVersion('1.2') === false
        // In cargo and in npm 1.2 is equivalent to 1.2.* so it is correct behavior.
        return '^' + item.trim();
    }
    return item.trim();
}
function cargo2npm(input) {
    let versions = input.split(',');
    versions = versions.map(convertToCaret);
    return versions.join(' ');
}
function notEmpty(s) {
    return s !== '';
}
function npm2cargo(input) {
    // istanbul ignore if
    if (!input) {
        return input;
    }
    // Note: this doesn't remove the ^
    const res = input
        .split((0, regex_1.regEx)(/\s+,?\s*|\s*,?\s+/))
        .map((str) => str.trim())
        .filter(notEmpty);
    const operators = ['^', '~', '=', '>', '<', '<=', '>='];
    for (let i = 0; i < res.length - 1; i += 1) {
        if (operators.includes(res[i])) {
            const newValue = res[i] + ' ' + res[i + 1];
            res.splice(i, 2, newValue);
        }
    }
    return res.join(', ');
}
const isLessThanRange = (version, range) => !!npm_1.api.isLessThanRange?.(version, cargo2npm(range));
const isValid = (input) => npm_1.api.isValid(cargo2npm(input));
exports.isValid = isValid;
const matches = (version, range) => npm_1.api.matches(version, cargo2npm(range));
function getSatisfyingVersion(versions, range) {
    return npm_1.api.getSatisfyingVersion(versions, cargo2npm(range));
}
function minSatisfyingVersion(versions, range) {
    return npm_1.api.minSatisfyingVersion(versions, cargo2npm(range));
}
const isSingleVersion = (constraint) => constraint.trim().startsWith('=') &&
    isVersion(constraint.trim().substring(1).trim());
function getNewValue({ currentValue, rangeStrategy, currentVersion, newVersion, }) {
    if (!currentValue || currentValue === '*') {
        return currentValue;
    }
    if (rangeStrategy === 'pin' || isSingleVersion(currentValue)) {
        let res = '=';
        if (currentValue.startsWith('= ')) {
            res += ' ';
        }
        res += newVersion;
        return res;
    }
    const newSemver = npm_1.api.getNewValue({
        currentValue: cargo2npm(currentValue),
        rangeStrategy,
        currentVersion,
        newVersion,
    });
    let newCargo = newSemver ? npm2cargo(newSemver) : null;
    // istanbul ignore if
    if (!newCargo) {
        logger_1.logger.info({ currentValue, newSemver }, 'Could not get cargo version from semver');
        return currentValue;
    }
    // Try to reverse any caret we added
    if (newCargo.startsWith('^') && !currentValue.startsWith('^')) {
        newCargo = newCargo.substring(1);
    }
    return newCargo;
}
exports.api = {
    ...npm_1.api,
    getNewValue,
    isLessThanRange,
    isSingleVersion,
    isValid: exports.isValid,
    matches,
    getSatisfyingVersion,
    minSatisfyingVersion,
};
exports.default = exports.api;
//# sourceMappingURL=index.js.map