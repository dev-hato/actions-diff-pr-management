"use strict";
// Code originally derived from https://github.com/hadfieldn/node-bunyan-prettystream but since heavily edited
// Neither fork nor original repo appear to be maintained
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenovateStream = exports.formatRecord = exports.getDetails = exports.getMeta = exports.indent = void 0;
const tslib_1 = require("tslib");
const stream_1 = require("stream");
const util = tslib_1.__importStar(require("util"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const json_stringify_pretty_compact_1 = tslib_1.__importDefault(require("json-stringify-pretty-compact"));
const bunyanFields = [
    'name',
    'hostname',
    'pid',
    'level',
    'v',
    'time',
    'msg',
    'start_time',
];
const metaFields = [
    'repository',
    'packageFile',
    'depType',
    'dependency',
    'dependencies',
    'branch',
];
const levels = {
    10: chalk_1.default.gray('TRACE'),
    20: chalk_1.default.blue('DEBUG'),
    30: chalk_1.default.green(' INFO'),
    40: chalk_1.default.magenta(' WARN'),
    50: chalk_1.default.red('ERROR'),
    60: chalk_1.default.bgRed('FATAL'),
};
function indent(str, leading = false) {
    const prefix = leading ? '       ' : '';
    return prefix + str.split(/\r?\n/).join('\n       '); // TODO #12874
}
exports.indent = indent;
function getMeta(rec) {
    if (!rec) {
        return '';
    }
    let res = rec.module ? ` [${rec.module}]` : ``;
    const filteredMeta = metaFields.filter((elem) => rec[elem]);
    if (!filteredMeta.length) {
        return res;
    }
    const metaStr = filteredMeta
        .map((field) => `${field}=${String(rec[field])}`)
        .join(', ');
    res = ` (${metaStr})${res}`;
    return chalk_1.default.gray(res);
}
exports.getMeta = getMeta;
function getDetails(rec) {
    if (!rec) {
        return '';
    }
    const recFiltered = { ...rec };
    delete recFiltered.module;
    Object.keys(recFiltered).forEach((key) => {
        if (key === 'logContext' ||
            bunyanFields.includes(key) ||
            metaFields.includes(key)) {
            delete recFiltered[key];
        }
    });
    const remainingKeys = Object.keys(recFiltered);
    if (remainingKeys.length === 0) {
        return '';
    }
    return `${remainingKeys
        .map((key) => `${indent(`"${key}": ${(0, json_stringify_pretty_compact_1.default)(recFiltered[key])}`, true)}`)
        .join(',\n')}\n`;
}
exports.getDetails = getDetails;
function formatRecord(rec) {
    const level = levels[rec.level];
    const msg = `${indent(rec.msg)}`;
    const meta = getMeta(rec);
    const details = getDetails(rec);
    return util.format('%s: %s%s\n%s', level, msg, meta, details);
}
exports.formatRecord = formatRecord;
class RenovateStream extends stream_1.Stream {
    constructor() {
        super();
        this.readable = true;
        this.writable = true;
    }
    // istanbul ignore next
    write(data) {
        this.emit('data', formatRecord(data));
        return true;
    }
}
exports.RenovateStream = RenovateStream;
//# sourceMappingURL=pretty-stdout.js.map