import type { BranchUpgradeConfig } from '../../../../types';
import { ChangeLogResult } from './types';
export declare function getChangeLogJSON(config: BranchUpgradeConfig): Promise<ChangeLogResult | null>;
