export interface GitlabIssue {
    iid: number;
    labels?: string[];
    title: string;
}
export interface GitlabComment {
    body: string;
    id: number;
}
export interface GitLabUser {
    id: number;
    username: string;
}
export interface GitLabMergeRequest {
    iid: number;
    title: string;
    state: string;
    source_branch: string;
    target_branch: string;
    description: string;
    diverged_commits_count: number;
    merge_status: string;
    assignee?: GitLabUser;
    assignees?: GitLabUser[];
    reviewers?: GitLabUser[];
    labels: string[];
    sha: string;
}
export interface UpdateMergeRequest {
    target_branch?: string;
    title?: string;
    assignee_id?: number;
    assignee_ids?: number[];
    reviewer_ids?: number[];
}
export declare type MergeMethod = 'merge' | 'rebase_merge' | 'ff';
export interface RepoResponse {
    archived: boolean;
    mirror: boolean;
    default_branch: string;
    empty_repo: boolean;
    ssh_url_to_repo: string;
    http_url_to_repo: string;
    forked_from_project: boolean;
    repository_access_level: 'disabled' | 'private' | 'enabled';
    merge_requests_access_level: 'disabled' | 'private' | 'enabled';
    merge_method: MergeMethod;
    path_with_namespace: string;
    squash_option?: 'never' | 'always' | 'default_on' | 'default_off';
}
export interface GitlabUserStatus {
    message?: string;
    message_html?: string;
    emoji?: string;
    availability: 'not_set' | 'busy';
}
