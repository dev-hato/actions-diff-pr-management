export interface GitlabInclude {
    local?: string;
}
export interface GitlabPipeline {
    include?: GitlabInclude[] | string;
}
export interface ImageObject {
    name: string;
    entrypoint?: string[];
}
export interface ServicesObject extends ImageObject {
    command?: string[];
    alias?: string;
}
export interface Job {
    image?: Image;
    services?: Services;
}
export declare type Image = ImageObject | string;
export declare type Services = (string | ServicesObject)[];
