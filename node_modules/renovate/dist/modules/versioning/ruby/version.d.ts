interface RubyVersion {
    major: number;
    minor: number;
    patch: number;
    prerelease: string[] | null;
}
declare const parse: (version: string) => RubyVersion;
declare const floor: (version: string) => string;
declare const increment: (from: string, to: string) => string;
declare const decrement: (version: string) => string;
export { parse, floor, increment, decrement };
