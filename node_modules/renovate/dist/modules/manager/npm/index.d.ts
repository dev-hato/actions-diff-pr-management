import { ProgrammingLanguage } from '../../../constants';
export { detectGlobalConfig } from './detect';
export { extractAllPackageFiles } from './extract';
export { bumpPackageVersion, updateDependency, updateLockedDependency, } from './update';
export { getRangeStrategy } from './range';
export declare const language = ProgrammingLanguage.JavaScript;
export declare const supportsLockFileMaintenance = true;
export declare const defaultConfig: {
    fileMatch: string[];
    rollbackPrs: boolean;
    versioning: string;
    digest: {
        prBodyDefinitions: {
            Change: string;
        };
    };
    prBodyDefinitions: {
        Change: string;
    };
};
export declare const supportedDatasources: string[];
