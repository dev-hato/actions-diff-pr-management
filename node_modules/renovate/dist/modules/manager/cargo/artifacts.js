"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateArtifacts = void 0;
const shlex_1 = require("shlex");
const error_messages_1 = require("../../../constants/error-messages");
const logger_1 = require("../../../logger");
const exec_1 = require("../../../util/exec");
const fs_1 = require("../../../util/fs");
async function cargoUpdate(manifestPath, isLockFileMaintenance) {
    let cmd = `cargo update --manifest-path ${(0, shlex_1.quote)(manifestPath)}`;
    // If we're updating a specific crate, `cargo-update` requires `--workspace`
    // for more information, see: https://github.com/renovatebot/renovate/issues/12332
    if (!isLockFileMaintenance) {
        cmd += ` --workspace`;
    }
    const execOptions = {
        docker: {
            image: 'rust',
        },
    };
    await (0, exec_1.exec)(cmd, execOptions);
}
async function updateArtifacts({ packageFileName, updatedDeps, newPackageFileContent, config, }) {
    logger_1.logger.debug(`cargo.updateArtifacts(${packageFileName})`);
    const isLockFileMaintenance = config.updateType === 'lockFileMaintenance';
    if (!isLockFileMaintenance &&
        (updatedDeps === undefined || updatedDeps.length < 1)) {
        logger_1.logger.debug('No updated cargo deps - returning null');
        return null;
    }
    // For standalone package crates, the `Cargo.lock` will be in the same
    // directory as `Cargo.toml` (ie. a sibling). For cargo workspaces, it
    // will be further up.
    const lockFileName = await (0, fs_1.findLocalSiblingOrParent)(packageFileName, 'Cargo.lock');
    const existingLockFileContent = lockFileName
        ? await (0, fs_1.readLocalFile)(lockFileName)
        : null;
    if (!existingLockFileContent || !lockFileName) {
        logger_1.logger.debug('No Cargo.lock found');
        return null;
    }
    try {
        await (0, fs_1.writeLocalFile)(packageFileName, newPackageFileContent);
        logger_1.logger.debug('Updating ' + lockFileName);
        await cargoUpdate(packageFileName, isLockFileMaintenance);
        logger_1.logger.debug('Returning updated Cargo.lock');
        const newCargoLockContent = await (0, fs_1.readLocalFile)(lockFileName);
        if (existingLockFileContent === newCargoLockContent) {
            logger_1.logger.debug('Cargo.lock is unchanged');
            return null;
        }
        return [
            {
                file: {
                    type: 'addition',
                    path: lockFileName,
                    contents: newCargoLockContent,
                },
            },
        ];
    }
    catch (err) {
        // istanbul ignore if
        if (err.message === error_messages_1.TEMPORARY_ERROR) {
            throw err;
        }
        logger_1.logger.debug({ err }, 'Failed to update Cargo lock file');
        return [
            {
                artifactError: {
                    lockFile: lockFileName,
                    stderr: err.message,
                },
            },
        ];
    }
}
exports.updateArtifacts = updateArtifacts;
//# sourceMappingURL=artifacts.js.map