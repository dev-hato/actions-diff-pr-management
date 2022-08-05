/**
 * Mark pair character
 * PairMarker aim to mark pair string as a single sentence.
 *
 * For example, Following sentence has two period(。). but it should treat a single sentence
 *
 * > I hear "I'm back to home." from radio.
 *
 * https://ja.wikipedia.org/wiki/%E6%8B%AC%E5%BC%A7
 */
/**
 * @typedef {{key:string,start:string,end:string}[]} PairMark
 */
const PAIR_MARKS = [
    {
        key: "double quote",
        start: `"`,
        end: `"`
    },
    {
        key: "angled bracket[]",
        start: `[`,
        end: `]`
    },
    {
        key: "round bracket()",
        start: `(`,
        end: `)`
    },
    {
        key: "curly brace{}",
        start: `{`,
        end: `}`
    },
    {
        key: "かぎ括弧「」",
        start: `「`,
        end: `」`
    },
    {
        key: "丸括弧（）",
        start: `（`,
        end: `）`
    },
    {
        key: "二重かぎ括弧『』",
        start: `『`,
        end: `』`
    },
    {
        key: "波括弧｛｝",
        start: `｛`,
        end: `｝`
    },
    {
        key: "角括弧［］",
        start: `［`,
        end: `］`
    },
    {
        key: "重角括弧〚〛",
        start: `〚`,
        end: `〛`
    },
    {
        key: "隅付き括弧【】",
        start: `【`,
        end: `】`
    }
];

// For readme
// console.log(PAIR_MARKS.map(pair => `- ${pair.key}: \`${pair.start}\` and \`${pair.end}\``).join("\n"));
export class PairMaker {
    mark(sourceCode) {
        const string = sourceCode.read();
        if (!string) {
            return;
        }
        // if current is in a context, should not start other context.
        // PairMaker does not support nest context by design.
        if (sourceCode.isInContext()) {
            // check that string is end mark?
            const pair = PAIR_MARKS.find(pair => pair.end === string);
            if (pair) {
                sourceCode.leaveContext(pair);
            }
        } else {
            const pair = PAIR_MARKS.find(pair => pair.start === string);
            if (pair) {
                sourceCode.enterContext(pair);
            }
        }
    }
}
