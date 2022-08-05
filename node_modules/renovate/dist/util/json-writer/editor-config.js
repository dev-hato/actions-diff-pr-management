"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorConfig = void 0;
const tslib_1 = require("tslib");
const editorconfig_1 = require("editorconfig");
const upath_1 = tslib_1.__importDefault(require("upath"));
const global_1 = require("../../config/global");
const indentation_type_1 = require("./indentation-type");
class EditorConfig {
    static async getCodeFormat(fileName) {
        const { localDir } = global_1.GlobalConfig.get();
        const knownProps = await (0, editorconfig_1.parse)(upath_1.default.join(localDir, fileName));
        return {
            indentationSize: EditorConfig.getIndentationSize(knownProps),
            indentationType: EditorConfig.getIndentationType(knownProps),
        };
    }
    static getIndentationType(knownProps) {
        const { indent_style: indentStyle } = knownProps;
        if (indentStyle === 'tab') {
            return indentation_type_1.IndentationType.Tab;
        }
        if (indentStyle === 'space') {
            return indentation_type_1.IndentationType.Space;
        }
        return undefined;
    }
    static getIndentationSize(knownProps) {
        const indentSize = Number(knownProps.indent_size);
        if (!Number.isNaN(indentSize) && Number.isInteger(indentSize)) {
            return indentSize;
        }
        return undefined;
    }
}
exports.EditorConfig = EditorConfig;
//# sourceMappingURL=editor-config.js.map