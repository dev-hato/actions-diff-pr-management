"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnabledManagersMigration = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const abstract_migration_1 = require("../base/abstract-migration");
class EnabledManagersMigration extends abstract_migration_1.AbstractMigration {
    constructor() {
        super(...arguments);
        this.propertyName = 'enabledManagers';
    }
    run(value) {
        if (is_1.default.array(value)) {
            const newValue = value.map((manager) => manager === 'yarn' ? 'npm' : manager);
            this.rewrite(newValue);
        }
    }
}
exports.EnabledManagersMigration = EnabledManagersMigration;
//# sourceMappingURL=enabled-managers-migration.js.map