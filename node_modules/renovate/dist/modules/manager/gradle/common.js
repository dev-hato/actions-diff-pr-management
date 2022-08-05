"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = exports.GRADLE_PLUGIN_PORTAL_REPO = exports.GOOGLE_REPO = exports.JCENTER_REPO = exports.MAVEN_REPO = void 0;
var common_1 = require("../../datasource/maven/common");
Object.defineProperty(exports, "MAVEN_REPO", { enumerable: true, get: function () { return common_1.MAVEN_REPO; } });
exports.JCENTER_REPO = 'https://jcenter.bintray.com/';
exports.GOOGLE_REPO = 'https://dl.google.com/android/maven2/';
exports.GRADLE_PLUGIN_PORTAL_REPO = 'https://plugins.gradle.org/m2/';
// TODO: convert to types
// eslint-disable-next-line typescript-enum/no-enum
var TokenType;
(function (TokenType) {
    TokenType["Space"] = "space";
    TokenType["LineComment"] = "lineComment";
    TokenType["MultiComment"] = "multiComment";
    TokenType["Newline"] = "newline";
    TokenType["Semicolon"] = "semicolon";
    TokenType["Colon"] = "colon";
    TokenType["Dot"] = "dot";
    TokenType["Comma"] = "comma";
    TokenType["Operator"] = "operator";
    TokenType["Assignment"] = "assignment";
    TokenType["Word"] = "word";
    TokenType["LeftParen"] = "leftParen";
    TokenType["RightParen"] = "rightParen";
    TokenType["LeftBracket"] = "leftBracket";
    TokenType["RightBracket"] = "rightBracket";
    TokenType["LeftBrace"] = "leftBrace";
    TokenType["RightBrace"] = "rightBrace";
    TokenType["SingleQuotedStart"] = "singleQuotedStart";
    TokenType["SingleQuotedFinish"] = "singleQuotedFinish";
    TokenType["DoubleQuotedStart"] = "doubleQuotedStart";
    TokenType["StringInterpolation"] = "interpolation";
    TokenType["IgnoredInterpolationStart"] = "ignoredInterpolation";
    TokenType["Variable"] = "variable";
    TokenType["DoubleQuotedFinish"] = "doubleQuotedFinish";
    TokenType["TripleSingleQuotedStart"] = "tripleQuotedStart";
    TokenType["TripleDoubleQuotedStart"] = "tripleDoubleQuotedStart";
    TokenType["TripleQuotedFinish"] = "tripleQuotedFinish";
    TokenType["Chars"] = "chars";
    TokenType["EscapedChar"] = "escapedChar";
    TokenType["String"] = "string";
    TokenType["UnknownFragment"] = "unknownFragment";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
//# sourceMappingURL=common.js.map