"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaiseDeprecationWarningsMigration = void 0;
const abstract_migration_1 = require("../base/abstract-migration");
class RaiseDeprecationWarningsMigration extends abstract_migration_1.AbstractMigration {
    constructor() {
        super(...arguments);
        this.deprecated = true;
        this.propertyName = 'raiseDeprecationWarnings';
    }
    run(value) {
        const suppressNotifications = this.get('suppressNotifications');
        if (value === false) {
            this.setHard('suppressNotifications', Array.isArray(suppressNotifications)
                ? suppressNotifications.concat(['deprecationWarningIssues'])
                : ['deprecationWarningIssues']);
        }
    }
}
exports.RaiseDeprecationWarningsMigration = RaiseDeprecationWarningsMigration;
//# sourceMappingURL=raise-deprecation-warnings-migration.js.map