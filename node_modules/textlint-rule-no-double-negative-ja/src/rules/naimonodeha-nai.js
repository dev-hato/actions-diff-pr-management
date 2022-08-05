// LICENSE : MIT
"use strict";
/*
    (c)「~ないものでは / もない」
    ~ない(否定助動詞 / 否定形容詞の連体形) + 形式名詞「もの」+ 判定詞「だ」の連用形「で」+ とりたて助詞「は / も」+補助形容詞「ない」
 */
import matchTokenStream from "./../matchTokenStream";
export default function (context) {
    const {RuleError} = context;
    const matchPatternないものでもない = matchTokenStream([
        {
            "basic_form": ["ない", "無い"]
        },
        {
            "reading": "モノ",// 漢字に対応するため
            "pos": "名詞"
        },
        {
            "conjugated_form": "連用形",
            "basic_form": "だ"
        },
        {
            "surface_form": "も",
            "pos": "助詞"
        },
        {
            "basic_form": ["ない", "無い"],
            "pos": "形容詞"
        }
    ]);
    const matchPatternないものではない = matchTokenStream([
        {
            "basic_form": ["ない", "無い"]
        },
        {
            "reading": "モノ",// 漢字に対応するため
            "pos": "名詞"
        },
        {
            "conjugated_form": "連用形",
            "basic_form": "だ"
        },
        {
            "surface_form": "は",
            "pos": "助詞"
        },
        {
            "basic_form": ["ない", "無い"],
            "pos": "形容詞"
        }
    ]);
    return (token) => {
        if (matchPatternないものでもない(token)) {
            return new RuleError("二重否定: 〜ないものでもない", {
                index: token.word_position - 1
            });
        }
        if (matchPatternないものではない(token)) {
            return new RuleError("二重否定: 〜ないものではない", {
                index: token.word_position - 1
            });
        }
    };
}