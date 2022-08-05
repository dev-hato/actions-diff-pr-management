interface NodeJsSchedule {
    lts?: string;
    maintenance?: string;
    end: string;
    start: string;
    codename?: string;
}
export declare type NodeJsData = Record<string, NodeJsSchedule>;
export declare type NodeJsScheduleWithVersion = {
    version: string;
} & NodeJsSchedule;
export declare function findScheduleForCodename(codename: string): NodeJsScheduleWithVersion | null;
export declare function findScheduleForVersion(version: string): NodeJsSchedule | null;
export {};
