import { getFormat as getFormatHook } from './hooks/getFormat';
import { getSource as getSourceHook } from './hooks/getSource';
import { load as loadHook } from './hooks/load';
import { resolve as resolveHook } from './hooks/resolve';
import './fspatch';
export declare const resolve: typeof resolveHook;
export declare const getFormat: typeof getFormatHook | undefined;
export declare const getSource: typeof getSourceHook | undefined;
export declare const load: typeof loadHook | undefined;
