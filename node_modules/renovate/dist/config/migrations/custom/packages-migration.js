"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackagesMigration = void 0;
const abstract_migration_1 = require("../base/abstract-migration");
class PackagesMigration extends abstract_migration_1.AbstractMigration {
    constructor() {
        super(...arguments);
        this.deprecated = true;
        this.propertyName = 'packages';
    }
    run(value) {
        const packageRules = this.get('packageRules');
        let newPackageRules = Array.isArray(packageRules) ? packageRules : [];
        if (Array.isArray(value)) {
            newPackageRules = newPackageRules.concat(value);
        }
        this.setHard('packageRules', newPackageRules);
    }
}
exports.PackagesMigration = PackagesMigration;
//# sourceMappingURL=packages-migration.js.map