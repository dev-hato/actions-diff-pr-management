import type { UpdateArtifact, UpdateArtifactsResult } from '../types';
export declare function updateArtifacts({ packageFileName: pipfileName, newPackageFileContent: newPipfileContent, config, }: UpdateArtifact): Promise<UpdateArtifactsResult[] | null>;
