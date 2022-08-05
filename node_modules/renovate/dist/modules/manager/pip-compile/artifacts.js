"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateArtifacts = exports.constructPipCompileCmd = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const shlex_1 = require("shlex");
const upath_1 = tslib_1.__importDefault(require("upath"));
const error_messages_1 = require("../../../constants/error-messages");
const logger_1 = require("../../../logger");
const exec_1 = require("../../../util/exec");
const fs_1 = require("../../../util/fs");
const git_1 = require("../../../util/git");
const regex_1 = require("../../../util/regex");
function getPythonConstraint(config) {
    const { constraints = {} } = config;
    const { python } = constraints;
    if (python) {
        logger_1.logger.debug('Using python constraint from config');
        return python;
    }
    return undefined;
}
function getPipToolsConstraint(config) {
    const { constraints = {} } = config;
    const { pipTools } = constraints;
    if (is_1.default.string(pipTools)) {
        logger_1.logger.debug('Using pipTools constraint from config');
        return pipTools;
    }
    return '';
}
const constraintLineRegex = (0, regex_1.regEx)(/^(#.*?\r?\n)+# {4}pip-compile(?<arguments>.*?)\r?\n/);
const allowedPipArguments = [
    '--allow-unsafe',
    '--generate-hashes',
    '--no-emit-index-url',
];
function constructPipCompileCmd(content, inputFileName, outputFileName) {
    const headers = constraintLineRegex.exec(content);
    const args = ['pip-compile'];
    if (headers?.groups) {
        logger_1.logger.debug({ header: headers[0] }, 'Found pip-compile header');
        for (const argument of (0, shlex_1.split)(headers.groups.arguments)) {
            if (allowedPipArguments.includes(argument)) {
                args.push(argument);
            }
            else if (argument.startsWith('--output-file=')) {
                const file = upath_1.default.parse(outputFileName).base;
                if (argument !== `--output-file=${file}`) {
                    // we don't trust the user-supplied output-file argument; use our value here
                    logger_1.logger.warn({ argument }, 'pip-compile was previously executed with an unexpected `--output-file` filename');
                }
                args.push(`--output-file=${file}`);
            }
            else if (argument.startsWith('--')) {
                logger_1.logger.trace({ argument }, 'pip-compile argument is not (yet) supported');
            }
            else {
                // ignore position argument (.in file)
            }
        }
    }
    args.push(upath_1.default.parse(inputFileName).base);
    return args.map((argument) => (0, shlex_1.quote)(argument)).join(' ');
}
exports.constructPipCompileCmd = constructPipCompileCmd;
async function updateArtifacts({ packageFileName: inputFileName, newPackageFileContent: newInputContent, config, }) {
    const outputFileName = inputFileName.replace((0, regex_1.regEx)(/(\.in)?$/), '.txt');
    logger_1.logger.debug(`pipCompile.updateArtifacts(${inputFileName}->${outputFileName})`);
    const existingOutput = await (0, fs_1.readLocalFile)(outputFileName, 'utf8');
    if (!existingOutput) {
        logger_1.logger.debug('No pip-compile output file found');
        return null;
    }
    try {
        await (0, fs_1.writeLocalFile)(inputFileName, newInputContent);
        if (config.isLockFileMaintenance) {
            await (0, fs_1.deleteLocalFile)(outputFileName);
        }
        const cmd = constructPipCompileCmd(existingOutput, inputFileName, outputFileName);
        const tagConstraint = getPythonConstraint(config);
        const pipToolsConstraint = getPipToolsConstraint(config);
        const execOptions = {
            cwdFile: inputFileName,
            docker: {
                image: 'python',
                tagConstraint,
                tagScheme: 'pep440',
            },
            preCommands: [
                `pip install --user ${(0, shlex_1.quote)(`pip-tools${pipToolsConstraint}`)}`,
            ],
        };
        logger_1.logger.debug({ cmd }, 'pip-compile command');
        await (0, exec_1.exec)(cmd, execOptions);
        const status = await (0, git_1.getRepoStatus)();
        if (!status?.modified.includes(outputFileName)) {
            return null;
        }
        logger_1.logger.debug('Returning updated pip-compile result');
        return [
            {
                file: {
                    type: 'addition',
                    path: outputFileName,
                    contents: await (0, fs_1.readLocalFile)(outputFileName, 'utf8'),
                },
            },
        ];
    }
    catch (err) {
        // istanbul ignore if
        if (err.message === error_messages_1.TEMPORARY_ERROR) {
            throw err;
        }
        logger_1.logger.debug({ err }, 'Failed to pip-compile');
        return [
            {
                artifactError: {
                    lockFile: outputFileName,
                    stderr: err.message,
                },
            },
        ];
    }
}
exports.updateArtifacts = updateArtifacts;
//# sourceMappingURL=artifacts.js.map