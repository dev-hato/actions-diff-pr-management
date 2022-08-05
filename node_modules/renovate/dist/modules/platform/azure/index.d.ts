import { BranchStatus, VulnerabilityAlert } from '../../../types';
import type { BranchStatusConfig, CreatePRConfig, EnsureCommentConfig, EnsureCommentRemovalConfig, EnsureIssueResult, FindPRConfig, Issue, MergePRConfig, PlatformParams, PlatformResult, Pr, RepoParams, RepoResult, UpdatePrConfig } from '../types';
import { AzurePr } from './types';
export declare function initPlatform({ endpoint, token, username, password, }: PlatformParams): Promise<PlatformResult>;
export declare function getRepos(): Promise<string[]>;
export declare function getRawFile(fileName: string, repoName?: string, branchOrTag?: string): Promise<string | null>;
export declare function getJsonFile(fileName: string, repoName?: string, branchOrTag?: string): Promise<any | null>;
export declare function initRepo({ repository, cloneSubmodules, }: RepoParams): Promise<RepoResult>;
export declare function getRepoForceRebase(): Promise<boolean>;
export declare function getPrList(): Promise<AzurePr[]>;
export declare function getPr(pullRequestId: number): Promise<Pr | null>;
export declare function findPr({ branchName, prTitle, state, }: FindPRConfig): Promise<Pr | null>;
export declare function getBranchPr(branchName: string): Promise<Pr | null>;
export declare function getBranchStatusCheck(branchName: string, context: string): Promise<BranchStatus | null>;
export declare function getBranchStatus(branchName: string): Promise<BranchStatus>;
export declare function createPr({ sourceBranch, targetBranch, prTitle: title, prBody: body, labels, draftPR, platformOptions, }: CreatePRConfig): Promise<Pr>;
export declare function updatePr({ number: prNo, prTitle: title, prBody: body, state, }: UpdatePrConfig): Promise<void>;
export declare function ensureComment({ number, topic, content, }: EnsureCommentConfig): Promise<boolean>;
export declare function ensureCommentRemoval(removeConfig: EnsureCommentRemovalConfig): Promise<void>;
export declare function setBranchStatus({ branchName, context, description, state, url: targetUrl, }: BranchStatusConfig): Promise<void>;
export declare function mergePr({ branchName, id: pullRequestId, }: MergePRConfig): Promise<boolean>;
export declare function massageMarkdown(input: string): string;
export declare function findIssue(): Promise<Issue | null>;
export declare function ensureIssue(): Promise<EnsureIssueResult | null>;
export declare function ensureIssueClosing(): Promise<void>;
export declare function getIssueList(): Promise<Issue[]>;
/**
 *
 * @param {number} issueNo
 * @param {string[]} assignees
 */
export declare function addAssignees(issueNo: number, assignees: string[]): Promise<void>;
/**
 *
 * @param {number} prNo
 * @param {string[]} reviewers
 */
export declare function addReviewers(prNo: number, reviewers: string[]): Promise<void>;
export declare function deleteLabel(prNumber: number, label: string): Promise<void>;
export declare function getVulnerabilityAlerts(): Promise<VulnerabilityAlert[]>;
