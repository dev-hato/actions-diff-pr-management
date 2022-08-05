"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const regex_1 = require("../../../util/regex");
const maven_1 = require("../../datasource/maven");
const common_1 = require("../../datasource/maven/common");
const sbt_package_1 = require("../../datasource/sbt-package");
const sbt_plugin_1 = require("../../datasource/sbt-plugin");
const versioning_1 = require("../../versioning");
const mavenVersioning = tslib_1.__importStar(require("../../versioning/maven"));
const stripComment = (str) => str.replace((0, regex_1.regEx)(/(^|\s+)\/\/.*$/), '');
const isSingleLineDep = (str) => (0, regex_1.regEx)(/^\s*(libraryDependencies|dependencyOverrides)\s*\+=\s*/).test(str);
const isDepsBegin = (str) => (0, regex_1.regEx)(/^\s*(libraryDependencies|dependencyOverrides)\s*\+\+=\s*/).test(str);
const isPluginDep = (str) => (0, regex_1.regEx)(/^\s*addSbtPlugin\s*\(.*\)\s*$/).test(str);
const isStringLiteral = (str) => (0, regex_1.regEx)(/^"[^"]*"$/).test(str);
const isScalaVersion = (str) => (0, regex_1.regEx)(/^\s*(?:ThisBuild\s*\/\s*)?scalaVersion\s*:=\s*"[^"]*"[\s,]*$/).test(str);
const getScalaVersion = (str) => str
    .replace((0, regex_1.regEx)(/^\s*(?:ThisBuild\s*\/\s*)?scalaVersion\s*:=\s*"/), '')
    .replace((0, regex_1.regEx)(/"[\s,]*$/), '');
const isPackageFileVersion = (str) => (0, regex_1.regEx)(/^(version\s*:=\s*).*$/).test(str);
const getPackageFileVersion = (str) => str
    .replace((0, regex_1.regEx)(/^\s*version\s*:=\s*/), '')
    .replace((0, regex_1.regEx)(/[\s,]*$/), '')
    .replace((0, regex_1.regEx)(/"/g), '');
/*
  https://www.scala-sbt.org/release/docs/Cross-Build.html#Publishing+conventions
 */
const normalizeScalaVersion = (str) => {
    // istanbul ignore if
    if (!str) {
        return str;
    }
    const versioning = (0, versioning_1.get)(mavenVersioning.id);
    if (versioning.isVersion(str)) {
        // Do not normalize unstable versions
        if (!versioning.isStable(str)) {
            return str;
        }
        // Do not normalize versions prior to 2.10
        if (!versioning.isGreaterThan(str, '2.10.0')) {
            return str;
        }
    }
    if ((0, regex_1.regEx)(/^\d+\.\d+\.\d+$/).test(str)) {
        return str.replace((0, regex_1.regEx)(/^(\d+)\.(\d+)\.\d+$/), '$1.$2');
    }
    // istanbul ignore next
    return str;
};
const isScalaVersionVariable = (str) => (0, regex_1.regEx)(/^\s*(?:ThisBuild\s*\/\s*)?scalaVersion\s*:=\s*[_a-zA-Z][_a-zA-Z0-9]*[\s,]*$/).test(str);
const getScalaVersionVariable = (str) => str
    .replace((0, regex_1.regEx)(/^\s*(?:ThisBuild\s*\/\s*)?scalaVersion\s*:=\s*/), '')
    .replace((0, regex_1.regEx)(/[\s,]*$/), '');
const isResolver = (str) => (0, regex_1.regEx)(/^\s*(resolvers\s*\+\+?=\s*((Seq|List|Stream)\()?)?"[^"]*"\s*at\s*"[^"]*"[\s,)]*$/).test(str);
const getResolverUrl = (str) => str
    .replace((0, regex_1.regEx)(/^\s*(resolvers\s*\+\+?=\s*((Seq|List|Stream)\()?)?"[^"]*"\s*at\s*"/), '')
    .replace((0, regex_1.regEx)(/"[\s,)]*$/), '');
const isVarDependency = (str) => (0, regex_1.regEx)(/^\s*(private\s*)?(lazy\s*)?val\s[_a-zA-Z][_a-zA-Z0-9]*\s*=.*(%%?).*%.*/).test(str);
const isVarDef = (str) => (0, regex_1.regEx)(/^\s*(private\s*)?(lazy\s*)?val\s+[_a-zA-Z][_a-zA-Z0-9]*\s*=\s*"[^"]*"\s*$/).test(str);
const isVarSeqSingleLine = (str) => (0, regex_1.regEx)(/^\s*(private\s*)?(lazy\s*)?val\s+[_a-zA-Z][_a-zA-Z0-9]*\s*=\s*(Seq|List|Stream)\(.*\).*\s*$/).test(str);
const isVarSeqMultipleLine = (str) => (0, regex_1.regEx)(/^\s*(private\s*)?(lazy\s*)?val\s+[_a-zA-Z][_a-zA-Z0-9]*\s*=\s*(Seq|List|Stream)\(.*[^)]*.*$/).test(str);
const getVarName = (str) => str
    .replace((0, regex_1.regEx)(/^\s*(private\s*)?(lazy\s*)?val\s+/), '')
    .replace((0, regex_1.regEx)(/\s*=\s*"[^"]*"\s*$/), '');
const isVarName = (str) => (0, regex_1.regEx)(/^[_a-zA-Z][_a-zA-Z0-9]*$/).test(str);
const getVarInfo = (str, ctx) => {
    const rightPart = str.replace((0, regex_1.regEx)(/^\s*(private\s*)?(lazy\s*)?val\s+[_a-zA-Z][_a-zA-Z0-9]*\s*=\s*"/), '');
    const val = rightPart.replace((0, regex_1.regEx)(/"\s*$/), '');
    return { val };
};
function parseDepExpr(expr, ctx) {
    const { scalaVersion, variables } = ctx;
    let { depType } = ctx;
    const isValidToken = (str) => isStringLiteral(str) || (isVarName(str) && !!variables[str]);
    const resolveToken = (str) => isStringLiteral(str)
        ? str.replace((0, regex_1.regEx)(/^"/), '').replace((0, regex_1.regEx)(/"$/), '')
        : variables[str].val;
    const tokens = expr
        .trim()
        .split((0, regex_1.regEx)(/("[^"]*")/g))
        .map((x) => ((0, regex_1.regEx)(/"[^"]*"/).test(x) ? x : x.replace((0, regex_1.regEx)(/[()]+/g), '')))
        .join('')
        .split((0, regex_1.regEx)(/\s*(%%?)\s*|\s*classifier\s*/));
    const [rawGroupId, groupOp, rawArtifactId, artifactOp, rawVersion, scopeOp, rawScope,] = tokens;
    if (!rawGroupId) {
        return null;
    }
    if (!isValidToken(rawGroupId)) {
        return null;
    }
    if (!rawArtifactId) {
        return null;
    }
    if (!isValidToken(rawArtifactId)) {
        return null;
    }
    if (artifactOp !== '%') {
        return null;
    }
    if (!rawVersion) {
        return null;
    }
    if (!isValidToken(rawVersion)) {
        return null;
    }
    if (scopeOp && scopeOp !== '%') {
        return null;
    }
    const groupId = resolveToken(rawGroupId);
    const depName = `${groupId}:${resolveToken(rawArtifactId)}`;
    const artifactId = groupOp === '%%' && scalaVersion
        ? `${resolveToken(rawArtifactId)}_${scalaVersion}`
        : resolveToken(rawArtifactId);
    const packageName = `${groupId}:${artifactId}`;
    const currentValue = resolveToken(rawVersion);
    if (!depType && rawScope) {
        depType = rawScope.replace((0, regex_1.regEx)(/^"/), '').replace((0, regex_1.regEx)(/"$/), '');
    }
    const result = {
        depName,
        packageName,
        currentValue,
    };
    if (variables[rawVersion]) {
        result.groupName = `${rawVersion}`;
    }
    if (depType) {
        result.depType = depType;
    }
    return result;
}
function parseSbtLine(acc, line, lineIndex, lines) {
    const { deps, registryUrls = [], variables = {} } = acc;
    let { isMultiDeps, scalaVersion, packageFileVersion } = acc;
    const ctx = {
        scalaVersion,
        variables,
    };
    let dep = null;
    let scalaVersionVariable = null;
    if (line !== '') {
        if (isScalaVersion(line)) {
            isMultiDeps = false;
            const rawScalaVersion = getScalaVersion(line);
            scalaVersion = normalizeScalaVersion(rawScalaVersion);
            dep = {
                datasource: maven_1.MavenDatasource.id,
                depName: 'scala',
                packageName: 'org.scala-lang:scala-library',
                currentValue: rawScalaVersion,
                separateMinorPatch: true,
            };
        }
        else if (isScalaVersionVariable(line)) {
            isMultiDeps = false;
            scalaVersionVariable = getScalaVersionVariable(line);
        }
        else if (isPackageFileVersion(line)) {
            packageFileVersion = getPackageFileVersion(line);
        }
        else if (isResolver(line)) {
            isMultiDeps = false;
            const url = getResolverUrl(line);
            registryUrls.push(url);
        }
        else if (isVarSeqSingleLine(line)) {
            isMultiDeps = false;
            const depExpr = line
                .replace((0, regex_1.regEx)(/^.*(Seq|List|Stream)\(\s*/), '')
                .replace((0, regex_1.regEx)(/\).*$/), '');
            dep = parseDepExpr(depExpr, {
                ...ctx,
            });
        }
        else if (isVarSeqMultipleLine(line)) {
            isMultiDeps = true;
            const depExpr = line.replace((0, regex_1.regEx)(/^.*(Seq|List|Stream)\(\s*/), '');
            dep = parseDepExpr(depExpr, {
                ...ctx,
            });
        }
        else if (isVarDef(line)) {
            variables[getVarName(line)] = getVarInfo(line, ctx);
        }
        else if (isVarDependency(line)) {
            isMultiDeps = false;
            const depExpr = line.replace((0, regex_1.regEx)(/^\s*(private\s*)?(lazy\s*)?val\s[_a-zA-Z][_a-zA-Z0-9]*\s*=\s*/), '');
            dep = parseDepExpr(depExpr, {
                ...ctx,
            });
        }
        else if (isSingleLineDep(line)) {
            isMultiDeps = false;
            const depExpr = line.replace((0, regex_1.regEx)(/^.*\+=\s*/), '');
            dep = parseDepExpr(depExpr, {
                ...ctx,
            });
        }
        else if (isPluginDep(line)) {
            isMultiDeps = false;
            const rightPart = line.replace((0, regex_1.regEx)(/^\s*addSbtPlugin\s*\(/), '');
            const depExpr = rightPart.replace((0, regex_1.regEx)(/\)\s*$/), '');
            dep = parseDepExpr(depExpr, {
                ...ctx,
                depType: 'plugin',
            });
        }
        else if (isDepsBegin(line)) {
            isMultiDeps = true;
        }
        else if (isMultiDeps) {
            const rightPart = line.replace((0, regex_1.regEx)(/^[\s,]*/), '');
            const depExpr = rightPart.replace((0, regex_1.regEx)(/[\s,]*$/), '');
            dep = parseDepExpr(depExpr, {
                ...ctx,
            });
        }
    }
    if (dep) {
        if (!dep.datasource) {
            if (dep.depType === 'plugin') {
                dep.datasource = sbt_plugin_1.SbtPluginDatasource.id;
                dep.registryUrls = [...registryUrls, ...sbt_plugin_1.defaultRegistryUrls];
            }
            else {
                dep.datasource = sbt_package_1.SbtPackageDatasource.id;
            }
        }
        deps.push({
            registryUrls,
            ...dep,
        });
    }
    if (lineIndex + 1 < lines.length) {
        return {
            ...acc,
            isMultiDeps,
            scalaVersion: scalaVersion ||
                (scalaVersionVariable &&
                    variables[scalaVersionVariable] &&
                    normalizeScalaVersion(variables[scalaVersionVariable].val)),
            packageFileVersion,
        };
    }
    return {
        deps,
        packageFileVersion,
    };
}
function extractPackageFile(content) {
    if (!content) {
        return null;
    }
    const equalsToNewLineRe = (0, regex_1.regEx)(/=\s*\n/, 'gm');
    const goodContentForParsing = content.replace(equalsToNewLineRe, '=');
    const lines = goodContentForParsing.split(regex_1.newlineRegex).map(stripComment);
    const acc = {
        registryUrls: [common_1.MAVEN_REPO],
        deps: [],
        isMultiDeps: false,
        scalaVersion: null,
        variables: {},
    };
    // TODO: needs major refactoring?
    const res = lines.reduce(parseSbtLine, acc);
    return res.deps.length ? res : null;
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map