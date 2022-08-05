import type { BranchConfig } from '../../../types';
declare type ParentBranch = {
    reuseExistingBranch: boolean;
    isModified?: boolean;
    isConflicted?: boolean;
};
export declare function shouldReuseExistingBranch(config: BranchConfig): Promise<ParentBranch>;
export {};
