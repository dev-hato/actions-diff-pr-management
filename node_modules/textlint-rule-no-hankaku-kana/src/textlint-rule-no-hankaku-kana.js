// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";
import {matchCaptureGroupAll} from "match-index"
const HankakuRegExp = /([\uff61-\uff9f]+)/g;
module.exports = function reporter(context) {
    const {Syntax, RuleError, report, fixer, getSource} = context;
    const helper = new RuleHelper(context);
    return {
        [Syntax.Str](node){
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }
            const nodeText = getSource(node);
            matchCaptureGroupAll(nodeText, HankakuRegExp).forEach(({text, index}) => {
                const ruleError = new RuleError(`Disallow to use 半角カタカナ: "${text}"`, {
                    index
                });
                report(node, ruleError);
            });
        }
    }
};