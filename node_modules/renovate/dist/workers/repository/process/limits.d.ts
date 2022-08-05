import type { RenovateConfig } from '../../../config/types';
import type { BranchConfig } from '../../types';
export declare function getPrHourlyRemaining(config: RenovateConfig): Promise<number>;
export declare function getConcurrentPrsRemaining(config: RenovateConfig, branches: BranchConfig[]): Promise<number>;
export declare function getPrsRemaining(config: RenovateConfig, branches: BranchConfig[]): Promise<number>;
export declare function getConcurrentBranchesRemaining(config: RenovateConfig, branches: BranchConfig[]): number;
export declare function getBranchesRemaining(config: RenovateConfig, branches: BranchConfig[]): Promise<number>;
