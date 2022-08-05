export interface Range {
    version: string;
    operator: string;
    delimiter: string;
}
declare const parse: (range: string) => Range;
declare const ltr: (version: string, range: string) => boolean;
export { parse, ltr };
