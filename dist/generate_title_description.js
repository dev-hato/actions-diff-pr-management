"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTitleDescription = generateTitleDescription;
// 値をインラインコードとして表示する
// 値に含まれるバッククォートの連続より長いバッククォートで囲み、値によってインラインコードが閉じられないようにする
// インラインコードの中ではMarkdownやメンション、Issueへのリンクが無効になる
function inlineCode(value) {
    var _a;
    const backquotes = (_a = value.match(/`+/g)) !== null && _a !== void 0 ? _a : [];
    const fence = "`".repeat(Math.max(0, ...backquotes.map((b) => b.length)) + 1);
    // 値の先頭や末尾がバッククォートの場合は、区切りとつながらないよう空白を入れる (表示時に1つずつ取り除かれる)
    const padding = value.startsWith("`") || value.endsWith("`") ? " " : "";
    return fence + padding + value + padding + fence;
}
// mermaidの文字列やディレクティブの外に出られないよう、文字・数字・空白・ . _ / - 以外を _ に置き換える
function mermaidText(value) {
    return value.replace(/[^\p{L}\p{N} ._/-]/gu, "_");
}
function generateTitleDescription() {
    const HEAD_REF = process.env.HEAD_REF || "";
    const PR_NUMBER = process.env.PR_NUMBER;
    const PR_TITLE_PREFIX = process.env.PR_TITLE_PREFIX || "";
    let head = process.env.BRANCH_NAME_PREFIX || "";
    if (HEAD_REF !== "") {
        head += "-" + HEAD_REF;
    }
    const headCode = inlineCode(head);
    const mermaidHeadRef = mermaidText(HEAD_REF);
    const mermaidHead = mermaidText(head);
    let title = PR_TITLE_PREFIX;
    let body = process.env.PR_DESCRIPTION_PREFIX || "";
    if (body !== "" && !body.endsWith("\n")) {
        body += "\n\n";
    }
    body += `本PR ( ${headCode} ) をマージすると差分が次のPRに反映されます。\n`;
    body += "* ";
    if (PR_NUMBER !== "") {
        body += `#${PR_NUMBER} ( `;
    }
    body += inlineCode(HEAD_REF);
    if (PR_NUMBER !== "") {
        body += " )";
    }
    body += "\n\n";
    body += `CIが再度実行されると本PR ( ${headCode} ) にforce pushされます。\n`;
    body += `> [!WARNING]\n`;
    body += `> 本PR ( ${headCode} ) にコミットを追加すると、CIが再度実行された際にコミットが消える場合があります。\n`;
    body += `> コミットを追加したい場合は本PR ( ${headCode} ) を起点に別途PRを立てることをおすすめします。\n`;
    body += "```mermaid\n";
    body += `%%{init: {'gitGraph': {'mainBranchName': '${mermaidHeadRef}'}}}%%\n`;
    body += "gitGraph\n";
    for (let i = 0; i < 2; i++) {
        body += "  commit\n";
    }
    body += `  branch "${mermaidHead}"\n`;
    body += `  checkout "${mermaidHead}"\n`;
    let commit = mermaidText(PR_TITLE_PREFIX);
    if (commit.length > 6) {
        commit = commit.substring(0, 6) + "......";
    }
    body += `  commit id: "${commit}"\n`;
    body += `  checkout "${mermaidHeadRef}"\n`;
    body += `  merge "${mermaidHead}"\n`;
    body += "```";
    if (PR_NUMBER !== "") {
        title += " #" + PR_NUMBER;
    }
    return {
        title,
        body,
    };
}
