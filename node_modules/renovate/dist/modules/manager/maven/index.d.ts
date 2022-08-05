import { ProgrammingLanguage } from '../../../constants';
export { extractAllPackageFiles } from './extract';
export { bumpPackageVersion, updateDependency } from './update';
export declare const language = ProgrammingLanguage.Java;
export declare const defaultConfig: {
    fileMatch: string[];
    versioning: string;
};
export declare const supportedDatasources: string[];
