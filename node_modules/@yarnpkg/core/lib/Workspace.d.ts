import { PortablePath } from '@yarnpkg/fslib';
import { HardDependencies, Manifest } from './Manifest';
import { Project } from './Project';
import { IdentHash } from './types';
import { Descriptor, Locator } from './types';
export declare class Workspace {
    readonly project: Project;
    readonly cwd: PortablePath;
    readonly relativeCwd: PortablePath;
    readonly anchoredDescriptor: Descriptor;
    readonly anchoredLocator: Locator;
    readonly locator: Locator;
    readonly manifest: Manifest;
    readonly workspacesCwds: Set<PortablePath>;
    dependencies: Map<IdentHash, Descriptor>;
    constructor(workspaceCwd: PortablePath, { project }: {
        project: Project;
    });
    setup(): Promise<void>;
    accepts(range: string): boolean;
    computeCandidateName(): string;
    /**
     * Find workspaces marked as dependencies/devDependencies of the current workspace recursively.
     *
     * @param rootWorkspace root workspace
     * @param project project
     *
     * @returns all the workspaces marked as dependencies
     */
    getRecursiveWorkspaceDependencies({ dependencies }?: {
        dependencies?: Array<HardDependencies>;
    }): Set<Workspace>;
    /**
     * Find workspaces which include the current workspace as a dependency/devDependency recursively.
     *
     * @param rootWorkspace root workspace
     * @param project project
     *
     * @returns all the workspaces marked as dependents
     */
    getRecursiveWorkspaceDependents({ dependencies }?: {
        dependencies?: Array<HardDependencies>;
    }): Set<Workspace>;
    /**
     * Retrieves all the child workspaces of a given root workspace recursively
     *
     * @param rootWorkspace root workspace
     * @param project project
     *
     * @returns all the child workspaces
     */
    getRecursiveWorkspaceChildren(): Workspace[];
    persistManifest(): Promise<void>;
}
