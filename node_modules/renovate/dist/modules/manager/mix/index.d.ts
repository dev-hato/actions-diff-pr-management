import { ProgrammingLanguage } from '../../../constants';
export { extractPackageFile } from './extract';
export { updateArtifacts } from './artifacts';
export declare const language = ProgrammingLanguage.Elixir;
export declare const defaultConfig: {
    fileMatch: string[];
    versioning: string;
};
export declare const supportedDatasources: string[];
