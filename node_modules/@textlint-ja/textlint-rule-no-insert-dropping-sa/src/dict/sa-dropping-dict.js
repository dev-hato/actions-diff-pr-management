// MIT © 2017 azu
"use strict";
// 「サ抜き」方向の検出
// 本来あるべき「サ」が抜け落ちる「サ抜き」の場合、「サ」が確実に入る用例でおかしな「サ抜け」は、「無そう」「良そう」の２種類
// http://www.anlp.jp/proceedings/annual_meeting/2012/pdf_dir/B1-2.pdf
export default {
    message: "「さ」が抜けています。",
    expected: "$1さ$2",
    // https://azu.github.io/morpheme-match/?text=これは問題無そう
    // https://azu.github.io/morpheme-match/?text=これは良そう
    // https://azu.github.io/morpheme-match/?text=芸術性なんてとても関係無そう。
    tokens: [
        {
            "basic_form": ["良い", "無", "無い"],
            "_capture": "$1"
        },
        {
            "surface_form": "そう",
            "pos_detail_1": ["接尾", "助詞類接続"],
            "_capture": "$2"
        }
    ]
};
