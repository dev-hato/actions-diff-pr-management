import type { UpdateType } from '../../config/types';
declare const MERGE_CONFIDENCE: string[];
declare type MergeConfidenceTuple = typeof MERGE_CONFIDENCE;
export declare type MergeConfidence = MergeConfidenceTuple[number];
export declare const confidenceLevels: Record<MergeConfidence, number>;
export declare function isActiveConfidenceLevel(confidence: string): boolean;
export declare function satisfiesConfidenceLevel(confidence: MergeConfidence, minimumConfidence: MergeConfidence): boolean;
export declare function getMergeConfidenceLevel(datasource: string, depName: string, currentVersion: string, newVersion: string, updateType: UpdateType): Promise<MergeConfidence>;
export {};
