"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptConfig = exports.tryDecrypt = exports.tryDecryptPublicKeyPKCS1 = exports.tryDecryptPublicKeyDefault = exports.tryDecryptPgp = void 0;
const tslib_1 = require("tslib");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const openpgp = tslib_1.__importStar(require("openpgp"));
const logger_1 = require("../logger");
const mask_1 = require("../util/mask");
const regex_1 = require("../util/regex");
const sanitize_1 = require("../util/sanitize");
const global_1 = require("./global");
async function tryDecryptPgp(privateKey, encryptedStr) {
    if (encryptedStr.length < 500) {
        // optimization during transition of public key -> pgp
        return null;
    }
    try {
        const pk = await openpgp.readPrivateKey({
            // prettier-ignore
            armoredKey: privateKey.replace((0, regex_1.regEx)(/\n[ \t]+/g), '\n'), // little massage to help a common problem
        });
        const startBlock = '-----BEGIN PGP MESSAGE-----\n\n';
        const endBlock = '\n-----END PGP MESSAGE-----';
        let armoredMessage = encryptedStr.trim();
        if (!armoredMessage.startsWith(startBlock)) {
            armoredMessage = `${startBlock}${armoredMessage}`;
        }
        if (!armoredMessage.endsWith(endBlock)) {
            armoredMessage = `${armoredMessage}${endBlock}`;
        }
        const message = await openpgp.readMessage({
            armoredMessage,
        });
        const { data } = await openpgp.decrypt({
            message,
            decryptionKeys: pk,
        });
        logger_1.logger.debug('Decrypted config using openpgp');
        return data;
    }
    catch (err) {
        logger_1.logger.debug({ err }, 'Could not decrypt using openpgp');
        return null;
    }
}
exports.tryDecryptPgp = tryDecryptPgp;
function tryDecryptPublicKeyDefault(privateKey, encryptedStr) {
    let decryptedStr = null;
    try {
        decryptedStr = crypto_1.default
            .privateDecrypt(privateKey, Buffer.from(encryptedStr, 'base64'))
            .toString();
        logger_1.logger.debug('Decrypted config using default padding');
    }
    catch (err) {
        logger_1.logger.debug('Could not decrypt using default padding');
    }
    return decryptedStr;
}
exports.tryDecryptPublicKeyDefault = tryDecryptPublicKeyDefault;
function tryDecryptPublicKeyPKCS1(privateKey, encryptedStr) {
    let decryptedStr = null;
    try {
        decryptedStr = crypto_1.default
            .privateDecrypt({
            key: privateKey,
            padding: crypto_1.default.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(encryptedStr, 'base64'))
            .toString();
    }
    catch (err) {
        logger_1.logger.debug('Could not decrypt using PKCS1 padding');
    }
    return decryptedStr;
}
exports.tryDecryptPublicKeyPKCS1 = tryDecryptPublicKeyPKCS1;
async function tryDecrypt(privateKey, encryptedStr, repository) {
    let decryptedStr = null;
    if (privateKey?.startsWith('-----BEGIN PGP PRIVATE KEY BLOCK-----')) {
        const decryptedObjStr = await tryDecryptPgp(privateKey, encryptedStr);
        if (decryptedObjStr) {
            try {
                const decryptedObj = JSON.parse(decryptedObjStr);
                const { o: org, r: repo, v: value } = decryptedObj;
                if (is_1.default.nonEmptyString(value)) {
                    if (is_1.default.nonEmptyString(org)) {
                        const orgName = org.replace((0, regex_1.regEx)(/\/$/), ''); // Strip trailing slash
                        if (is_1.default.nonEmptyString(repo)) {
                            const scopedRepository = `${orgName}/${repo}`;
                            if (scopedRepository.toLowerCase() === repository.toLowerCase()) {
                                decryptedStr = value;
                            }
                            else {
                                logger_1.logger.debug({ scopedRepository }, 'Secret is scoped to a different repository');
                                const error = new Error('config-validation');
                                error.validationError = `Encrypted secret is scoped to a different repository: "${scopedRepository}".`;
                                throw error;
                            }
                        }
                        else {
                            const scopedOrg = `${orgName}/`;
                            if (repository.toLowerCase().startsWith(scopedOrg.toLowerCase())) {
                                decryptedStr = value;
                            }
                            else {
                                logger_1.logger.debug({ scopedOrg }, 'Secret is scoped to a different org');
                                const error = new Error('config-validation');
                                error.validationError = `Encrypted secret is scoped to a different org: "${scopedOrg}".`;
                                throw error;
                            }
                        }
                    }
                    else {
                        const error = new Error('config-validation');
                        error.validationError = `Encrypted value in config is missing a scope.`;
                        throw error;
                    }
                }
                else {
                    const error = new Error('config-validation');
                    error.validationError = `Encrypted value in config is missing a value.`;
                    throw error;
                }
            }
            catch (err) {
                logger_1.logger.warn({ err }, 'Could not parse decrypted string');
            }
        }
    }
    else {
        decryptedStr = tryDecryptPublicKeyDefault(privateKey, encryptedStr);
        if (!is_1.default.string(decryptedStr)) {
            decryptedStr = tryDecryptPublicKeyPKCS1(privateKey, encryptedStr);
        }
    }
    return decryptedStr;
}
exports.tryDecrypt = tryDecrypt;
async function decryptConfig(config, repository) {
    logger_1.logger.trace({ config }, 'decryptConfig()');
    const decryptedConfig = { ...config };
    const { privateKey, privateKeyOld } = global_1.GlobalConfig.get();
    for (const [key, val] of Object.entries(config)) {
        if (key === 'encrypted' && is_1.default.object(val)) {
            logger_1.logger.debug({ config: val }, 'Found encrypted config');
            if (privateKey) {
                for (const [eKey, eVal] of Object.entries(val)) {
                    logger_1.logger.debug('Trying to decrypt ' + eKey);
                    let decryptedStr = await tryDecrypt(privateKey, eVal, repository);
                    if (privateKeyOld && !is_1.default.nonEmptyString(decryptedStr)) {
                        logger_1.logger.debug(`Trying to decrypt with old private key`);
                        decryptedStr = await tryDecrypt(privateKeyOld, eVal, repository);
                    }
                    if (!is_1.default.nonEmptyString(decryptedStr)) {
                        const error = new Error('config-validation');
                        error.validationError = `Failed to decrypt field ${eKey}. Please re-encrypt and try again.`;
                        throw error;
                    }
                    logger_1.logger.debug(`Decrypted ${eKey}`);
                    if (eKey === 'npmToken') {
                        const token = decryptedStr.replace((0, regex_1.regEx)(/\n$/), '');
                        (0, sanitize_1.addSecretForSanitizing)(token);
                        logger_1.logger.debug({ decryptedToken: (0, mask_1.maskToken)(token) }, 'Migrating npmToken to npmrc');
                        if (is_1.default.string(decryptedConfig.npmrc)) {
                            /* eslint-disable no-template-curly-in-string */
                            if (decryptedConfig.npmrc.includes('${NPM_TOKEN}')) {
                                logger_1.logger.debug('Replacing ${NPM_TOKEN} with decrypted token');
                                decryptedConfig.npmrc = decryptedConfig.npmrc.replace((0, regex_1.regEx)(/\${NPM_TOKEN}/g), token);
                            }
                            else {
                                logger_1.logger.debug('Appending _authToken= to end of existing npmrc');
                                decryptedConfig.npmrc = decryptedConfig.npmrc.replace((0, regex_1.regEx)(/\n?$/), `\n_authToken=${token}\n`);
                            }
                            /* eslint-enable no-template-curly-in-string */
                        }
                        else {
                            logger_1.logger.debug('Adding npmrc to config');
                            decryptedConfig.npmrc = `//registry.npmjs.org/:_authToken=${token}\n`;
                        }
                    }
                    else {
                        decryptedConfig[eKey] = decryptedStr;
                        (0, sanitize_1.addSecretForSanitizing)(decryptedStr);
                    }
                }
            }
            else {
                logger_1.logger.error('Found encrypted data but no privateKey');
            }
            delete decryptedConfig.encrypted;
        }
        else if (is_1.default.array(val)) {
            decryptedConfig[key] = [];
            for (const item of val) {
                if (is_1.default.object(item) && !is_1.default.array(item)) {
                    decryptedConfig[key].push(await decryptConfig(item, repository));
                }
                else {
                    decryptedConfig[key].push(item);
                }
            }
        }
        else if (is_1.default.object(val) && key !== 'content') {
            decryptedConfig[key] = await decryptConfig(val, repository);
        }
    }
    delete decryptedConfig.encrypted;
    logger_1.logger.trace({ config: decryptedConfig }, 'decryptedConfig');
    return decryptedConfig;
}
exports.decryptConfig = decryptConfig;
//# sourceMappingURL=decrypt.js.map