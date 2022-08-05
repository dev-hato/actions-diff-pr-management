import type { RenovateConfig } from '../types';
import type { Migration, MigrationConstructor } from './types';
export declare class MigrationsService {
    #private;
    static readonly removedProperties: ReadonlySet<string>;
    static readonly renamedProperties: ReadonlyMap<string, string>;
    static readonly customMigrations: ReadonlyArray<MigrationConstructor>;
    static run(originalConfig: RenovateConfig): RenovateConfig;
    static isMigrated(originalConfig: RenovateConfig, migratedConfig: RenovateConfig): boolean;
    protected static getMigrations(originalConfig: RenovateConfig, migratedConfig: RenovateConfig): ReadonlyArray<Migration>;
}
