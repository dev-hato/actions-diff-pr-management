"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.extractPackageFile = exports.defaultConfig = exports.language = void 0;
const tslib_1 = require("tslib");
const moo_1 = tslib_1.__importDefault(require("moo"));
const constants_1 = require("../../../constants");
const regex_1 = require("../../../util/regex");
const nuget_1 = require("../../datasource/nuget");
exports.language = constants_1.ProgrammingLanguage.NET;
exports.defaultConfig = {
    fileMatch: ['\\.cake$'],
};
const lexer = moo_1.default.states({
    main: {
        lineComment: { match: /\/\/.*?$/ },
        multiLineComment: { match: /\/\*[^]*?\*\//, lineBreaks: true },
        dependency: {
            match: /^#(?:addin|tool|module|load|l)\s+(?:nuget|dotnet):.*$/, // TODO #12870
        },
        dependencyQuoted: {
            match: /^#(?:addin|tool|module|load|l)\s+"(?:nuget|dotnet):[^"]+"\s*$/,
            value: (s) => s.trim().slice(1, -1),
        },
        unknown: moo_1.default.fallback,
    },
});
function parseDependencyLine(line) {
    try {
        let url = line.replace((0, regex_1.regEx)(/^[^:]*:/), '');
        const isEmptyHost = url.startsWith('?');
        url = isEmptyHost ? `http://localhost/${url}` : url;
        const { origin: registryUrl, protocol, searchParams } = new URL(url);
        const depName = searchParams.get('package');
        const currentValue = searchParams.get('version') ?? undefined;
        const result = {
            datasource: nuget_1.NugetDatasource.id,
            depName,
            currentValue,
        };
        if (!isEmptyHost) {
            if (protocol.startsWith('http')) {
                result.registryUrls = [registryUrl];
            }
            else {
                result.skipReason = 'unsupported-url';
            }
        }
        return result;
    }
    catch (err) {
        return null;
    }
}
function extractPackageFile(content) {
    const deps = [];
    lexer.reset(content);
    let token = lexer.next();
    while (token) {
        const { type, value } = token;
        if (type === 'dependency' || type === 'dependencyQuoted') {
            const dep = parseDependencyLine(value);
            if (dep) {
                deps.push(dep);
            }
        }
        token = lexer.next();
    }
    return { deps };
}
exports.extractPackageFile = extractPackageFile;
exports.supportedDatasources = [nuget_1.NugetDatasource.id];
//# sourceMappingURL=index.js.map