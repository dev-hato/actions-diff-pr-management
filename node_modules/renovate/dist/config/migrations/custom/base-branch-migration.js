"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBranchMigration = void 0;
const abstract_migration_1 = require("../base/abstract-migration");
class BaseBranchMigration extends abstract_migration_1.AbstractMigration {
    constructor() {
        super(...arguments);
        this.deprecated = true;
        this.propertyName = 'baseBranch';
    }
    run(value) {
        this.setSafely('baseBranches', Array.isArray(value) ? value : [value]);
    }
}
exports.BaseBranchMigration = BaseBranchMigration;
//# sourceMappingURL=base-branch-migration.js.map