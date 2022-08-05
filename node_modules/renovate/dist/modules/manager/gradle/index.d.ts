import { ProgrammingLanguage } from '../../../constants';
export { extractAllPackageFiles } from './extract';
export { updateDependency } from './update';
export declare const language = ProgrammingLanguage.Java;
export declare const defaultConfig: {
    fileMatch: string[];
    timeout: number;
    versioning: string;
};
export declare const supportedDatasources: string[];
