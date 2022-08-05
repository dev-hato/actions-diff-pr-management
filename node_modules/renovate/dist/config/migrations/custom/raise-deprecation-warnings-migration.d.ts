import { AbstractMigration } from '../base/abstract-migration';
export declare class RaiseDeprecationWarningsMigration extends AbstractMigration {
    readonly deprecated = true;
    readonly propertyName = "raiseDeprecationWarnings";
    run(value: unknown): void;
}
