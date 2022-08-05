"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostRulesMigration = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const abstract_migration_1 = require("../base/abstract-migration");
class HostRulesMigration extends abstract_migration_1.AbstractMigration {
    constructor() {
        super(...arguments);
        this.propertyName = 'hostRules';
    }
    run(value) {
        const newHostRules = value.map((rule) => {
            const newRule = {};
            for (const [key, value] of Object.entries(rule)) {
                if (key === 'platform') {
                    if (is_1.default.string(value)) {
                        newRule.hostType ?? (newRule.hostType = value);
                    }
                    continue;
                }
                if (key === 'endpoint' ||
                    key === 'host' ||
                    key === 'baseUrl' ||
                    key === 'hostName' ||
                    key === 'domainName') {
                    if (is_1.default.string(value)) {
                        newRule.matchHost ?? (newRule.matchHost = value);
                    }
                    continue;
                }
                newRule[key] = value;
            }
            return newRule;
        });
        this.rewrite(newHostRules);
    }
}
exports.HostRulesMigration = HostRulesMigration;
//# sourceMappingURL=host-rules-migration.js.map