import type { UpdateArtifact, UpdateArtifactsResult } from '../types';
export declare function constructPipCompileCmd(content: string, inputFileName: string, outputFileName: string): string;
export declare function updateArtifacts({ packageFileName: inputFileName, newPackageFileContent: newInputContent, config, }: UpdateArtifact): Promise<UpdateArtifactsResult[] | null>;
