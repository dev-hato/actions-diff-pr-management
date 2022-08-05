"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearProblems = exports.getProblems = exports.levels = exports.addStream = exports.removeMeta = exports.addMeta = exports.setMeta = exports.getContext = exports.setContext = exports.logger = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const bunyan = tslib_1.__importStar(require("bunyan"));
const nanoid_1 = require("nanoid");
const cmd_serializer_1 = tslib_1.__importDefault(require("./cmd-serializer"));
const config_serializer_1 = tslib_1.__importDefault(require("./config-serializer"));
const err_serializer_1 = tslib_1.__importDefault(require("./err-serializer"));
const pretty_stdout_1 = require("./pretty-stdout");
const utils_1 = require("./utils");
let logContext = process.env.LOG_CONTEXT ?? (0, nanoid_1.nanoid)();
let curMeta = {};
const problems = new utils_1.ProblemStream();
// istanbul ignore if: not easily testable
if (is_1.default.string(process.env.LOG_LEVEL)) {
    process.env.LOG_LEVEL = process.env.LOG_LEVEL.toLowerCase().trim();
}
(0, utils_1.validateLogLevel)(process.env.LOG_LEVEL);
const stdout = {
    name: 'stdout',
    level: process.env.LOG_LEVEL ||
        /* istanbul ignore next: not testable */ 'info',
    stream: process.stdout,
};
// istanbul ignore else: not testable
if (process.env.LOG_FORMAT !== 'json') {
    // TODO: typings (#9615)
    const prettyStdOut = new pretty_stdout_1.RenovateStream();
    prettyStdOut.pipe(process.stdout);
    stdout.stream = prettyStdOut;
    stdout.type = 'raw';
}
const bunyanLogger = bunyan.createLogger({
    name: 'renovate',
    serializers: {
        body: config_serializer_1.default,
        cmd: cmd_serializer_1.default,
        config: config_serializer_1.default,
        migratedConfig: config_serializer_1.default,
        originalConfig: config_serializer_1.default,
        presetConfig: config_serializer_1.default,
        oldConfig: config_serializer_1.default,
        newConfig: config_serializer_1.default,
        err: err_serializer_1.default,
    },
    streams: [
        stdout,
        {
            name: 'problems',
            level: 'warn',
            stream: problems,
            type: 'raw',
        },
    ].map(utils_1.withSanitizer),
});
const logFactory = (level) => (p1, p2) => {
    if (p2) {
        // meta and msg provided
        bunyanLogger[level]({ logContext, ...curMeta, ...p1 }, p2);
    }
    else if (is_1.default.string(p1)) {
        // only message provided
        bunyanLogger[level]({ logContext, ...curMeta }, p1);
    }
    else {
        // only meta provided
        bunyanLogger[level]({ logContext, ...curMeta, ...p1 });
    }
};
const loggerLevels = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
];
exports.logger = {};
loggerLevels.forEach((loggerLevel) => {
    exports.logger[loggerLevel] = logFactory(loggerLevel);
});
function setContext(value) {
    logContext = value;
}
exports.setContext = setContext;
function getContext() {
    return logContext;
}
exports.getContext = getContext;
// setMeta overrides existing meta, may remove fields if no longer existing
function setMeta(obj) {
    curMeta = { ...obj };
}
exports.setMeta = setMeta;
// addMeta overrides or adds fields but does not remove any
function addMeta(obj) {
    curMeta = { ...curMeta, ...obj };
}
exports.addMeta = addMeta;
// removeMeta removes the provided fields from meta
function removeMeta(fields) {
    Object.keys(curMeta).forEach((key) => {
        if (fields.includes(key)) {
            delete curMeta[key];
        }
    });
}
exports.removeMeta = removeMeta;
function addStream(stream) {
    bunyanLogger.addStream((0, utils_1.withSanitizer)(stream));
}
exports.addStream = addStream;
function levels(name, level) {
    bunyanLogger.levels(name, level);
}
exports.levels = levels;
function getProblems() {
    return problems.getProblems();
}
exports.getProblems = getProblems;
function clearProblems() {
    return problems.clearProblems();
}
exports.clearProblems = clearProblems;
//# sourceMappingURL=index.js.map