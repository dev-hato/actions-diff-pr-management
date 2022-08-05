export interface ChangeLogNotes {
    body?: string;
    id?: number;
    name?: string;
    tag?: string;
    notesSourceUrl: string;
    url: string;
}
export interface ChangeLogChange {
    date: Date;
    message: string;
    sha: string;
}
export interface ChangeLogRelease {
    changes: ChangeLogChange[];
    compare: {
        url?: string;
    };
    date: string | Date;
    releaseNotes?: ChangeLogNotes;
    version: string;
    gitRef: string;
}
export interface ChangeLogProject {
    depName?: string;
    type: 'github' | 'gitlab';
    apiBaseUrl?: string;
    baseUrl: string;
    repository: string;
    sourceUrl: string;
    sourceDirectory?: string;
}
export declare enum ChangeLogError {
    MissingGithubToken = 1,
    MissingGitlabToken = 2
}
export interface ChangeLogResult {
    hasReleaseNotes?: boolean;
    project?: ChangeLogProject;
    versions?: ChangeLogRelease[];
    error?: ChangeLogError;
}
export interface ChangeLogFile {
    changelogFile: string;
    changelogMd: string;
}
