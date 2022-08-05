import type { UpdateArtifact, UpdateArtifactsResult } from '../types';
export declare function updateArtifacts({ packageFileName, newPackageFileContent, updatedDeps, config, }: UpdateArtifact): Promise<UpdateArtifactsResult[] | null>;
