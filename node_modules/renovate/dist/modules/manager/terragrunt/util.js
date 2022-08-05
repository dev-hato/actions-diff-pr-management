"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileContainsDependency = exports.getTerragruntDependencyType = exports.keyValueExtractionRegex = void 0;
const regex_1 = require("../../../util/regex");
const common_1 = require("./common");
exports.keyValueExtractionRegex = (0, regex_1.regEx)(/^\s*source\s+=\s+"(?<value>[^"]+)"\s*$/);
function getTerragruntDependencyType(value) {
    switch (value) {
        case 'terraform': {
            return common_1.TerragruntDependencyTypes.terragrunt;
        }
        default: {
            return common_1.TerragruntDependencyTypes.unknown;
        }
    }
}
exports.getTerragruntDependencyType = getTerragruntDependencyType;
function checkFileContainsDependency(content, checkList) {
    return checkList.some((check) => content.includes(check));
}
exports.checkFileContainsDependency = checkFileContainsDependency;
//# sourceMappingURL=util.js.map