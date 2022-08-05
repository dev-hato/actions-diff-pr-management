import type { Pr } from '../types';
import type { GhRestPr } from './types';
/**
 * @see https://docs.github.com/en/rest/reference/pulls#list-pull-requests
 */
export declare function coerceRestPr(pr: GhRestPr | null | undefined): Pr | null;
