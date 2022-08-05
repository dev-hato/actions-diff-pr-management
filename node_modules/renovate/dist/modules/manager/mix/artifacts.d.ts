import type { UpdateArtifact, UpdateArtifactsResult } from '../types';
export declare function updateArtifacts({ packageFileName, updatedDeps, newPackageFileContent, }: UpdateArtifact): Promise<UpdateArtifactsResult[] | null>;
