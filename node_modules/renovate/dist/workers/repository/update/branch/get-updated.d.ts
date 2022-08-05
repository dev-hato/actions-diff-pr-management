import type { ArtifactError } from '../../../../modules/manager/types';
import type { FileChange } from '../../../../util/git/types';
import type { BranchConfig } from '../../../types';
export interface PackageFilesResult {
    artifactErrors: ArtifactError[];
    reuseExistingBranch?: boolean;
    updatedPackageFiles: FileChange[];
    updatedArtifacts: FileChange[];
}
export declare function getUpdatedPackageFiles(config: BranchConfig): Promise<PackageFilesResult>;
