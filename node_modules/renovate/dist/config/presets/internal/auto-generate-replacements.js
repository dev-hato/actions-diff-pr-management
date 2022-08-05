"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPresets = void 0;
function generatePackageRules({ matchCurrentVersion, matchDatasources, replacements, replacementVersion, }) {
    const rules = [];
    for (const replacement of replacements) {
        const [matchPackageNames, replacementName] = replacement;
        rules.push({
            matchCurrentVersion,
            matchDatasources,
            matchPackageNames,
            replacementName,
            replacementVersion,
        });
    }
    return rules;
}
function addPresets(presets, template) {
    const { title, description, packageRules } = template;
    presets[title] = {
        description,
        packageRules: generatePackageRules(packageRules),
    };
    const ext = presets.all?.extends ?? [];
    ext.push(`replacements:${title}`);
    ext.sort();
}
exports.addPresets = addPresets;
//# sourceMappingURL=auto-generate-replacements.js.map