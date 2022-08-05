"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripEmojis = exports.unemojify = exports.stripHexCode = exports.emojify = exports.setEmojiConfig = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const emoji_regex_1 = tslib_1.__importDefault(require("emoji-regex"));
const emojibase_1 = require("emojibase");
const emoji_js_1 = tslib_1.__importDefault(require("emojibase-regex/emoji.js"));
const shortcode_js_1 = tslib_1.__importDefault(require("emojibase-regex/shortcode.js"));
const data_files_generated_1 = tslib_1.__importDefault(require("../data-files.generated"));
const regex_1 = require("./regex");
let unicodeEmoji = true;
let mappingsInitialized = false;
const shortCodesByHex = new Map();
const hexCodesByShort = new Map();
function lazyInitMappings() {
    if (!mappingsInitialized) {
        const table = JSON.parse(data_files_generated_1.default.get('node_modules/emojibase-data/en/shortcodes/github.json'));
        for (const [hex, val] of Object.entries(table)) {
            const shortCodes = is_1.default.array(val) ? val : [val];
            shortCodesByHex.set(hex, `:${shortCodes[0]}:`);
            shortCodes.forEach((shortCode) => {
                hexCodesByShort.set(`:${shortCode}:`, hex);
            });
        }
        mappingsInitialized = true;
    }
}
function setEmojiConfig(config) {
    unicodeEmoji = !!config.unicodeEmoji;
}
exports.setEmojiConfig = setEmojiConfig;
const shortCodeRegex = (0, regex_1.regEx)(shortcode_js_1.default.source, 'g');
function emojify(text) {
    if (!unicodeEmoji) {
        return text;
    }
    lazyInitMappings();
    return text.replace(shortCodeRegex, (shortCode) => {
        const hexCode = hexCodesByShort.get(shortCode);
        return hexCode
            ? (0, emojibase_1.fromCodepointToUnicode)((0, emojibase_1.fromHexcodeToCodepoint)(hexCode))
            : shortCode;
    });
}
exports.emojify = emojify;
const emojiRegexSrc = [emoji_js_1.default, (0, emoji_regex_1.default)()].map(({ source }) => source);
const emojiRegex = new RegExp(`(?:${emojiRegexSrc.join('|')})`, 'g'); // TODO #12875 cannot figure it out
const excludedModifiers = new Set([
    '20E3',
    '200D',
    'FE0E',
    'FE0F',
    '1F3FB',
    '1F3FC',
    '1F3FD',
    '1F3FE',
    '1F3FF',
    '1F9B0',
    '1F9B1',
    '1F9B2',
    '1F9B3',
]);
function stripHexCode(input) {
    return input
        .split('-')
        .filter((modifier) => !excludedModifiers.has(modifier))
        .join('-');
}
exports.stripHexCode = stripHexCode;
function unemojify(text) {
    if (unicodeEmoji) {
        return text;
    }
    lazyInitMappings();
    return text.replace(emojiRegex, (emoji) => {
        const hexCode = stripHexCode((0, emojibase_1.fromUnicodeToHexcode)(emoji));
        const shortCode = shortCodesByHex.get(hexCode);
        return shortCode ?? '�';
    });
}
exports.unemojify = unemojify;
function stripEmoji(emoji) {
    const hexCode = stripHexCode((0, emojibase_1.fromUnicodeToHexcode)(emoji));
    const codePoint = (0, emojibase_1.fromHexcodeToCodepoint)(hexCode);
    const result = (0, emojibase_1.fromCodepointToUnicode)(codePoint);
    return result;
}
function stripEmojis(input) {
    return input.replace(emojiRegex, stripEmoji);
}
exports.stripEmojis = stripEmojis;
//# sourceMappingURL=emoji.js.map