// LICENSE : MIT
"use strict";
/*
    (f) ないとはいいきれない
*/
import matchTokenStream from "./../matchTokenStream";
export default function (context) {
    const {RuleError} = context;
    const matchPatternないといいきれない = matchTokenStream([
        {
            "basic_form": ["ない", "無い"]
        },
        {
            "surface_form": "と",
            "pos": "助詞"
        },
        {
            "reading": "イイ"
        },
        {
            "reading": "キレ",
            "pos": "動詞"
        },
        {
            "basic_form": ["ない", "無い"]
        }
    ]);
    const matchPatternないとはいいきれない = matchTokenStream([
        {
            "basic_form": ["ない", "無い"]
        },
        {
            "surface_form": "と",
            "pos": "助詞"
        },
        {
            "surface_form": "は",
            "pos": "助詞"
        },
        {
            "reading": "イイ"
        },
        {
            "reading": "キレ",
            "pos": "動詞"
        },
        {
            "basic_form": ["ない", "無い"]
        }
    ]);
    return (token) => {
        if (matchPatternないといいきれない(token)) {
            return new RuleError("二重否定: 〜ないといいきれない", {
                index: token.word_position - 1
            });
        }
        if (matchPatternないとはいいきれない(token)) {
            return new RuleError("二重否定: 〜ないとはいいきれない", {
                index: token.word_position - 1
            });
        }
    };
}