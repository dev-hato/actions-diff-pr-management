export declare type GitTreeNode = {
    type: 'tree' | 'blob';
    path: string;
    mode: string;
};
export declare type GitProtocol = 'ssh' | 'http' | 'https';
export declare type GitOptions = Record<string, null | string | number>;
