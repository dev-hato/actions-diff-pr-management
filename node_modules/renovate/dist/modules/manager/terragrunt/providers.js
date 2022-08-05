"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTerragruntProvider = exports.sourceExtractionRegex = void 0;
const regex_1 = require("../../../util/regex");
const common_1 = require("./common");
const util_1 = require("./util");
exports.sourceExtractionRegex = (0, regex_1.regEx)(/^(?:(?<hostname>(?:[a-zA-Z0-9]+\.+)+[a-zA-Z0-9]+)\/)?(?:(?<namespace>[^/]+)\/)?(?<type>[^/]+)/);
function extractBracesContent(content) {
    const stack = [];
    let i = 0;
    for (i; i < content.length; i += 1) {
        if (content[i] === '{') {
            stack.push(content[i]);
        }
        else if (content[i] === '}') {
            stack.pop();
            if (stack.length === 0) {
                break;
            }
        }
    }
    return i;
}
function extractTerragruntProvider(startingLine, lines, moduleName) {
    const lineNumber = startingLine;
    let line;
    const deps = [];
    const managerData = {
        moduleName,
        terragruntDependencyType: common_1.TerragruntDependencyTypes.terragrunt,
    };
    const dep = { managerData };
    const teraformContent = lines
        .slice(lineNumber)
        .join('\n')
        .substring(0, extractBracesContent(lines.slice(lineNumber).join('\n')))
        .split(regex_1.newlineRegex);
    for (let lineNo = 0; lineNo < teraformContent.length; lineNo += 1) {
        line = teraformContent[lineNo];
        const kvGroups = util_1.keyValueExtractionRegex.exec(line)?.groups;
        if (kvGroups) {
            managerData.source = kvGroups.value;
            managerData.sourceLine = lineNumber + lineNo;
        }
    }
    deps.push(dep);
    return { lineNumber, dependencies: deps };
}
exports.extractTerragruntProvider = extractTerragruntProvider;
//# sourceMappingURL=providers.js.map