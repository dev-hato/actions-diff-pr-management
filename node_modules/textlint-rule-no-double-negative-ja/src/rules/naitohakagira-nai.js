// LICENSE : MIT
"use strict";
/*
    (g) ないと(は/も)かぎらない
 */
import matchTokenStream from "./../matchTokenStream";
export default function (context) {
    const {RuleError} = context;
    const matchPatternないとはかぎらない = matchTokenStream([
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
            "reading": "カギラ",
            "pos": "動詞"
        },
        {
            "basic_form": ["ない", "無い"]
        }
    ]);
    const matchPatternないともかぎらない = matchTokenStream([
        {
            "basic_form": ["ない", "無い"]
        },
        {
            "surface_form": "と",
            "pos": "助詞"
        },
        {
            "surface_form": "も",
            "pos": "助詞"
        },
        {
            "reading": "カギラ",
            "pos": "動詞"
        },
        {
            "basic_form": ["ない", "無い"],
        }
    ]);
    return (token) => {
        if (matchPatternないとはかぎらない(token)) {
            return new RuleError("二重否定: 〜ないとはかぎらない", {
                index: token.word_position - 1
            });
        }
        if (matchPatternないともかぎらない(token)) {
            return new RuleError("二重否定: 〜ないともかぎらない", {
                index: token.word_position - 1
            });
        }
    };
}