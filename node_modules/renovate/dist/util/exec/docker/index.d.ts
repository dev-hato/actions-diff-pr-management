import type { DockerOptions } from '../types';
export declare function prefetchDockerImage(taggedImage: string): Promise<void>;
export declare function resetPrefetchedImages(): void;
export declare function getDockerTag(depName: string, constraint: string, scheme: string): Promise<string>;
export declare function removeDockerContainer(image: string, prefix: string): Promise<void>;
export declare function removeDanglingContainers(): Promise<void>;
export declare function generateDockerCommand(commands: string[], preCommands: string[], options: DockerOptions): Promise<string>;
