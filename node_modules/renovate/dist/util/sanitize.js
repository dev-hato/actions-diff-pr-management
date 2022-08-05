"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSanitizedSecretsList = exports.addSecretForSanitizing = exports.sanitize = exports.redactedFields = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const string_1 = require("./string");
const globalSecrets = new Set();
const repoSecrets = new Set();
exports.redactedFields = [
    'authorization',
    'token',
    'githubAppKey',
    'npmToken',
    'npmrc',
    'privateKey',
    'privateKeyOld',
    'gitPrivateKey',
    'forkToken',
    'password',
];
function sanitize(input) {
    if (!input) {
        return input;
    }
    let output = input;
    [globalSecrets, repoSecrets].forEach((secrets) => {
        secrets.forEach((secret) => {
            while (output.includes(secret)) {
                output = output.replace(secret, '**redacted**');
            }
        });
    });
    return output;
}
exports.sanitize = sanitize;
const GITHUB_APP_TOKEN_PREFIX = 'x-access-token:';
function addSecretForSanitizing(secret, type = 'repo') {
    if (!is_1.default.nonEmptyString(secret)) {
        return;
    }
    const secrets = type === 'repo' ? repoSecrets : globalSecrets;
    secrets.add(secret);
    secrets.add((0, string_1.toBase64)(secret));
    if (secret.startsWith(GITHUB_APP_TOKEN_PREFIX)) {
        const trimmedSecret = secret.replace(GITHUB_APP_TOKEN_PREFIX, '');
        secrets.add(trimmedSecret);
        secrets.add((0, string_1.toBase64)(trimmedSecret));
    }
}
exports.addSecretForSanitizing = addSecretForSanitizing;
function clearSanitizedSecretsList(type = 'repo') {
    const secrets = type === 'repo' ? repoSecrets : globalSecrets;
    secrets.clear();
}
exports.clearSanitizedSecretsList = clearSanitizedSecretsList;
//# sourceMappingURL=sanitize.js.map