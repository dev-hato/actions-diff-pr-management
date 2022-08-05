// LICENSE : MIT
"use strict";
// tokens -> event emitter -> return check
import {tokenize} from "kuromojin";
import なくはない from "./rules/nakuha-nai";
import ないでもない from "./rules/naidemo-nai";
import ないものではない from "./rules/naimonodeha-nai";
import ないことはない from "./rules/naikotoha-nai";
import ないわけではない from "./rules/naiwakedeha-nai";
import ないとはいいきれない from "./rules/naitohaiikire-nai";
import ないとはかぎらない from "./rules/naitohakagira-nai";
export default function (context) {
    const {Syntax,getSource, report,RuleError} = context;
    // initialize each rules
    const ruleなくもない = なくはない(context);
    const ruleないでもない = ないでもない(context);
    const ruleないものではない = ないものではない(context);
    const ruleないことはない = ないことはない(context);
    const ruleないわけではない = ないわけではない(context);
    const ruleないとはいいきれない = ないとはいいきれない(context);
    const ruleないとはかぎらない = ないとはかぎらない(context);
    return {
        [Syntax.Str](node){
            const text = getSource(node);
            const results = [];
            const pushError = (error) => {
                if (error) {
                    results.push(error);
                }
            };
            return tokenize(text).then(tokens => {
                tokens.forEach(token => {
                    pushError(ruleなくもない(token));
                    pushError(ruleないでもない(token));
                    pushError(ruleないものではない(token));
                    pushError(ruleないことはない(token));
                    pushError(ruleないわけではない(token));
                    pushError(ruleないとはいいきれない(token));
                    pushError(ruleないとはかぎらない(token));
                });
            }).then(()=> {
                results.forEach(error => {
                    report(node, error);
                })
            })
        }
    }

}