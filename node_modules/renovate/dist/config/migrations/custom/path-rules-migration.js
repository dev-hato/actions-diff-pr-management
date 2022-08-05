"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathRulesMigration = void 0;
const abstract_migration_1 = require("../base/abstract-migration");
class PathRulesMigration extends abstract_migration_1.AbstractMigration {
    constructor() {
        super(...arguments);
        this.deprecated = true;
        this.propertyName = 'pathRules';
    }
    run(value) {
        const packageRules = this.get('packageRules');
        if (Array.isArray(value)) {
            this.setHard('packageRules', Array.isArray(packageRules) ? packageRules.concat(value) : value);
        }
    }
}
exports.PathRulesMigration = PathRulesMigration;
//# sourceMappingURL=path-rules-migration.js.map