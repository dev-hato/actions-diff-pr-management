import { GitlabHttp } from '../../../util/http/gitlab';
export declare const gitlabApi: GitlabHttp;
export declare function getUserID(username: string): Promise<number>;
export declare function isUserBusy(user: string): Promise<boolean>;
