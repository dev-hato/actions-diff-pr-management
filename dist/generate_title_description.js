"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTitleDescription = generateTitleDescription;
function generateTitleDescription() {
    var HEAD_REF = process.env.HEAD_REF;
    var escapedHeadRef = HEAD_REF.replace(/#/g, "");
    var PR_NUMBER = process.env.PR_NUMBER;
    var PR_TITLE_PREFIX = process.env.PR_TITLE_PREFIX;
    var head = process.env.BRANCH_NAME_PREFIX;
    if (HEAD_REF !== "") {
        head += "-" + HEAD_REF;
    }
    var escapedHead = head.replace(/#/g, "");
    var title = PR_TITLE_PREFIX;
    var body = process.env.PR_DESCRIPTION_PREFIX;
    body += "\u672CPR ( `".concat(escapedHead, "` ) \u3092\u30DE\u30FC\u30B8\u3059\u308B\u3068\u5DEE\u5206\u304C\u6B21\u306EPR\u306B\u53CD\u6620\u3055\u308C\u307E\u3059\u3002\n");
    body += "* ";
    if (PR_NUMBER !== "") {
        body += "#".concat(PR_NUMBER, " ( ");
    }
    body += "`".concat(escapedHeadRef, "`");
    if (PR_NUMBER !== "") {
        body += " )";
    }
    body += "\n\n";
    body += "CI\u304C\u518D\u5EA6\u5B9F\u884C\u3055\u308C\u308B\u3068\u672CPR ( `".concat(escapedHead, "` ) \u306Bforce push\u3055\u308C\u307E\u3059\u3002\n");
    body += "```mermaid\n";
    body += "%%{init: {'gitGraph': {'mainBranchName': '".concat(escapedHeadRef, "'}}}%%\n");
    body += "gitGraph\n";
    for (var i = 0; i < 2; i++) {
        body += "  commit\n";
    }
    body += "  branch ".concat(escapedHead, "\n");
    body += "  checkout ".concat(escapedHead, "\n");
    var commit = PR_TITLE_PREFIX;
    if (commit.length > 6) {
        commit = commit.substring(0, 6) + "......";
    }
    body += "  commit id: \"".concat(commit, "\"\n");
    body += "  checkout ".concat(escapedHeadRef, "\n");
    body += "  merge ".concat(escapedHead, "\n");
    body += "```";
    if (PR_NUMBER !== "") {
        title += " #" + PR_NUMBER;
    }
    return {
        title: title,
        body: body,
    };
}
