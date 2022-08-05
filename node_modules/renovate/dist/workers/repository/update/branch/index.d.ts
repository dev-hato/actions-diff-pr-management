import { BranchConfig, BranchResult, PrBlockedBy } from '../../../types';
export interface ProcessBranchResult {
    branchExists: boolean;
    prBlockedBy?: PrBlockedBy;
    prNo?: number;
    result: BranchResult;
}
export declare function processBranch(branchConfig: BranchConfig): Promise<ProcessBranchResult>;
