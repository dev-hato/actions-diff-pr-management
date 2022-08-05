"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const traverse_1 = tslib_1.__importDefault(require("traverse"));
function configSerializer(config) {
    const templateFields = ['prBody'];
    const contentFields = [
        'content',
        'contents',
        'packageLockParsed',
        'yarnLockParsed',
    ];
    const arrayFields = ['packageFiles', 'upgrades'];
    return (0, traverse_1.default)(config).map(function scrub(val) {
        if (this.key && val) {
            if (templateFields.includes(this.key)) {
                this.update('[Template]');
            }
            if (contentFields.includes(this.key)) {
                this.update('[content]');
            }
            // istanbul ignore if
            if (arrayFields.includes(this.key)) {
                this.update('[Array]');
            }
        }
    });
}
exports.default = configSerializer;
//# sourceMappingURL=config-serializer.js.map