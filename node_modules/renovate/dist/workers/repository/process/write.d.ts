import type { RenovateConfig } from '../../../config/types';
import { BranchConfig } from '../../types';
export declare type WriteUpdateResult = 'done' | 'automerged';
export declare function writeUpdates(config: RenovateConfig, allBranches: BranchConfig[]): Promise<WriteUpdateResult>;
