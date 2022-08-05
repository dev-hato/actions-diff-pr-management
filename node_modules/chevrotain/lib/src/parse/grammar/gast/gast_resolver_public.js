"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGrammar = exports.resolveGrammar = void 0;
var utils_1 = require("@chevrotain/utils");
var resolver_1 = require("../resolver");
var checks_1 = require("../checks");
var errors_public_1 = require("../../errors_public");
function resolveGrammar(options) {
    options = (0, utils_1.defaults)(options, {
        errMsgProvider: errors_public_1.defaultGrammarResolverErrorProvider
    });
    var topRulesTable = {};
    (0, utils_1.forEach)(options.rules, function (rule) {
        topRulesTable[rule.name] = rule;
    });
    return (0, resolver_1.resolveGrammar)(topRulesTable, options.errMsgProvider);
}
exports.resolveGrammar = resolveGrammar;
function validateGrammar(options) {
    options = (0, utils_1.defaults)(options, {
        errMsgProvider: errors_public_1.defaultGrammarValidatorErrorProvider
    });
    return (0, checks_1.validateGrammar)(options.rules, options.maxLookahead, options.tokenTypes, options.errMsgProvider, options.grammarName);
}
exports.validateGrammar = validateGrammar;
//# sourceMappingURL=gast_resolver_public.js.map