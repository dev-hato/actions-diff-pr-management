"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrUpdatesTable = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../../../logger");
const regex_1 = require("../../../../../util/regex");
const template = tslib_1.__importStar(require("../../../../../util/template"));
function getRowDefinition(prBodyColumns, upgrade) {
    const res = [];
    if (upgrade.prBodyDefinitions) {
        for (const header of prBodyColumns) {
            const value = upgrade.prBodyDefinitions[header];
            res.push({ header, value });
        }
    }
    return res;
}
function getNonEmptyColumns(prBodyColumns, rows) {
    const res = [];
    for (const header of prBodyColumns) {
        for (const row of rows) {
            if (row[header]?.length) {
                if (!res.includes(header)) {
                    res.push(header);
                }
            }
        }
    }
    return res;
}
function getPrUpdatesTable(config) {
    if (config.prBodyColumns === undefined) {
        logger_1.logger.warn('getPrUpdatesTable - prBodyColumns is undefined');
        return '';
    }
    const tableValues = config.upgrades
        .filter((upgrade) => upgrade !== undefined)
        .map((upgrade) => {
        const res = {};
        const rowDefinition = getRowDefinition(config.prBodyColumns ?? [], upgrade);
        for (const column of rowDefinition) {
            const { header, value } = column;
            try {
                // istanbul ignore else
                if (value) {
                    res[header] = template
                        .compile(value, upgrade)
                        .replace((0, regex_1.regEx)(/``/g), '');
                }
                else {
                    res[header] = '';
                }
            }
            catch (err) /* istanbul ignore next */ {
                logger_1.logger.warn({ header, value, err }, 'Handlebars compilation error');
            }
        }
        return res;
    });
    const tableColumns = getNonEmptyColumns(config.prBodyColumns, tableValues);
    let res = '\n\nThis PR contains the following updates:\n\n';
    res += '| ' + tableColumns.join(' | ') + ' |\n';
    res += '|' + tableColumns.map(() => '---|').join('') + '\n';
    const rows = [];
    for (const row of tableValues) {
        let val = '|';
        for (const column of tableColumns) {
            const content = row[column]
                ? row[column]
                    .replace((0, regex_1.regEx)(/^@/), '@&#8203;')
                    .replace((0, regex_1.regEx)(/\|/g), '\\|')
                : '';
            val += ` ${content} |`;
        }
        val += '\n';
        rows.push(val);
    }
    const uniqueRows = [...new Set(rows)];
    res += uniqueRows.join('');
    res += '\n\n';
    return res;
}
exports.getPrUpdatesTable = getPrUpdatesTable;
//# sourceMappingURL=updates-table.js.map