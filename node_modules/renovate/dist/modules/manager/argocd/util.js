"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileTestRegex = exports.keyValueExtractionRegex = void 0;
const regex_1 = require("../../../util/regex");
exports.keyValueExtractionRegex = (0, regex_1.regEx)(/^\s*(?<key>[^\s]+):\s+"?(?<value>[^"\s]+)"?\s*$/);
// looks for `apiVersion: argoproj.io/
exports.fileTestRegex = (0, regex_1.regEx)(/\s*apiVersion:\s*argoproj.io\/\s*/);
//# sourceMappingURL=util.js.map