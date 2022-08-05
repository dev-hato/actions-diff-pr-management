export { updateArtifacts } from './lockfile';
export { extractPackageFile } from './extract';
export declare const supportedDatasources: string[];
export declare const supportsLockFileMaintenance = true;
export declare const defaultConfig: {
    commitMessageTopic: string;
    fileMatch: string[];
    versioning: string;
    pinDigests: boolean;
};
