// LICENSE : MIT
"use strict";
/*

    (b)「~ないでも / はない」
    ~ない(否定助動詞/否定形容詞「ない」の連体形)+連用形「で」+とりたて助詞「も / は」+補助形容詞「ない」
 */
import matchTokenStream from "./../matchTokenStream";
export default function (context) {
    const {RuleError} = context;

    const monaiTokens = [
        {
            "basic_form": ["ない", "無い"]
        },
        {
            "surface_form": "で",
            "pos": "助詞"
        },

        {
            "surface_form": "も",
            "pos": "助詞"
        },
        {
            "basic_form": ["ない", "無い"],
            "pos": "形容詞"
        }
    ];

    const nakuhaTokens = [
        {
            "basic_form": ["ない", "無い"]
        },
        {
            "surface_form": "で",
            "conjugated_form": "連用形"
        },

        {
            "surface_form": "は",
            "pos": "助詞"
        },
        {
            "basic_form": ["ない", "無い"],
            "pos": "形容詞"
        }
    ];
    const matchPatternないでもない = matchTokenStream(nakuhaTokens);
    const matchPatternないではない = matchTokenStream(monaiTokens);
    return (token) => {
        if (matchPatternないでもない(token)) {
            return new RuleError("二重否定: 〜ないでもない", {
                index: token.word_position - 1
            });
        }
        if (matchPatternないではない(token)) {
            return new RuleError("二重否定: 〜ないではない", {
                index: token.word_position - 1
            });
        }
    };
}