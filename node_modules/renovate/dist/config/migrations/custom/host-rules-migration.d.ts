import { AbstractMigration } from '../base/abstract-migration';
export declare class HostRulesMigration extends AbstractMigration {
    readonly propertyName = "hostRules";
    run(value: Record<string, unknown>[]): void;
}
