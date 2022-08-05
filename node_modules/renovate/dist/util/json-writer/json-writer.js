"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONWriter = void 0;
const indentation_type_1 = require("./indentation-type");
class JSONWriter {
    constructor(codeFormat = {}) {
        this.indentationSize = codeFormat.indentationSize ?? 2;
        this.indentationType = codeFormat.indentationType ?? indentation_type_1.IndentationType.Space;
    }
    write(json, newLineAtTheEnd = true) {
        let content = JSON.stringify(json, null, this.indentation);
        if (newLineAtTheEnd) {
            content = content.concat('\n');
        }
        return content;
    }
    get indentation() {
        if (this.indentationType === indentation_type_1.IndentationType.Tab) {
            return '\t';
        }
        return this.indentationSize;
    }
}
exports.JSONWriter = JSONWriter;
//# sourceMappingURL=json-writer.js.map