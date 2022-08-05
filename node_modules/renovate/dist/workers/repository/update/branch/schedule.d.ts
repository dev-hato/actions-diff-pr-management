import type { RenovateConfig } from '../../../../config/types';
export declare function hasValidTimezone(timezone: string): [true] | [false, string];
export declare function hasValidSchedule(schedule: string[] | null | 'at any time'): [true] | [false, string];
export declare function isScheduledNow(config: RenovateConfig, scheduleKey?: 'schedule' | 'automergeSchedule'): boolean;
