import type { GitTreeNode } from '../../git';
export declare type GithubGitBase = {
    sha: string;
    url: string;
    size: number;
};
/**
 * https://docs.github.com/en/rest/reference/git#get-a-tree
 */
export declare type GithubGitTreeNode = GithubGitBase & GitTreeNode;
export declare type GithubGitTree = {
    sha: string;
    url: string;
    tree: GithubGitTreeNode[];
    truncated: boolean;
};
/**
 * https://docs.github.com/en/rest/reference/git#get-a-blob
 */
export declare type GithubGitBlob = {
    type: string;
    content: string;
    encoding: string;
} & GithubGitBase;
