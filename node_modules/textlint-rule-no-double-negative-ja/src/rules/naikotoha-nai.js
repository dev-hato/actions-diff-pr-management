// LICENSE : MIT
"use strict";
/*
    (d)「~ないことは / もない」
    ~ない(否定助動詞 / 否定形容詞の連体形) + 形式名詞「こと」+ とりたて助詞「は / も」+ 形容詞「ない」
 */
import matchTokenStream from "./../matchTokenStream";

export default function (context) {
    const { RuleError } = context;
    const matchPatternないことはない = matchTokenStream([
        {
            "basic_form": ["ない", "無い"]
        },
        {
            "reading": "コト",// 漢字に対応するため
            "pos": "名詞"
        },
        {
            "surface_form": "は",
            "pos": "助詞"
        },
        {
            "basic_form": ["ない", "無い"]
            //"pos": ["形容詞", "助動詞"]
        }
    ]);
    const matchPatternないこともない = matchTokenStream([
        {
            "basic_form": ["ない", "無い"]
        },
        {
            "reading": "コト",// 漢字に対応するため
            "pos": "名詞"
        },
        {
            "surface_form": "も",
            "pos": "助詞"
        },
        [
            // ないこともないでしょう。
            {
                "basic_form": ["ない", "無い"],
                "conjugated_type": ["特殊・ナイ"]
            },
            // ないこともない。
            {
                "basic_form": ["ない", "無い"],
                "pos": "形容詞"
            }
        ]
    ]);
    return (token) => {
        if (matchPatternないことはない(token)) {
            return new RuleError("二重否定: 〜ないことはない", {
                index: token.word_position - 1
            });
        }
        if (matchPatternないこともない(token)) {
            return new RuleError("二重否定: 〜ないこともない", {
                index: token.word_position - 1
            });
        }
    };
}
