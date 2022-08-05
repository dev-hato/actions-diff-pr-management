const DEFAULT_OPTIONS = {
    startIndex: 1
};
const report = (context, options = {}) => {
    const { Syntax, RuleError, report, fixer } = context;
    // start index number
    let startIndex = options.startIndex !== undefined ? options.startIndex : DEFAULT_OPTIONS.startIndex;
    const shortcuts = [];
    const definitions = [];
    return {
        // Markdown specific type
        // It is not documented
        ["LinkReference"](node) {
            // ^identifer
            if (node.identifier && node.identifier[0] === "^" && node.referenceType === "shortcut") {
                shortcuts.push({
                    node,
                    identifier: node.identifier
                });
            }
        },
        ["Definition"](node) {
            if (node.identifier && node.identifier[0] === "^") {
                definitions.push({
                    node,
                    identifier: node.identifier
                });
            }
        },
        [Syntax.DocumentExit]() {
            // Check Pair
            shortcuts.forEach((shortcut, index) => {
                const hasDefinition = definitions.some(definition => {
                    return definition.identifier === shortcut.identifier;
                });
                if (hasDefinition) {
                    return;
                }
                // Workaround for remark
                // remark can not treat Definition correctly
                // For more details, see https://twitter.com/azu_re/status/1137019229322981376
                // Convert LinkReference to Definition
                const afterNodesOfShortcut = shortcuts.slice(index + 1);
                const shortcutNodeAsDefinitionNodeIndex = afterNodesOfShortcut.findIndex(definition => {
                    return definition.identifier === shortcut.identifier;
                });
                if (shortcutNodeAsDefinitionNodeIndex !== -1) {
                    // move the node into definition
                    const [shortcutNodeAsDefinitionNode] = shortcuts.splice(index + 1 + shortcutNodeAsDefinitionNodeIndex, 1);
                    definitions.push(shortcutNodeAsDefinitionNode);
                    return;
                }
                report(shortcut.node, new RuleError(`Not found definition for the shortcut`));
            });
            // Check Identifier
            shortcuts.forEach((shortcut, index) => {
                const expectedSortedNumber = startIndex + index;
                // 1 + 0 = "^1"
                const expectedShortcutIdentifier = String(`^${expectedSortedNumber}`);
                if (expectedShortcutIdentifier === shortcut.identifier) {
                    return;
                }
                const pairDefinition = definitions.find(definition => {
                    return definition.identifier === shortcut.identifier;
                });
                // [^childStr]
                const childStr = Array.isArray(shortcut.node.children) && shortcut.node.children[0];
                if (pairDefinition && childStr) {
                    // report fixable error
                    report(childStr, new RuleError(`Should use incremental number for identifier`, {
                        fix: fixer.replaceText(childStr, expectedShortcutIdentifier)
                    }));
                    const pairDefinitionReplace = `[^${pairDefinition.identifier}]`;
                    report(pairDefinition.node, new RuleError(`Should use incremental number for definition`, {
                        fix: fixer.replaceTextRange([0, pairDefinitionReplace.length - 1], `[^${expectedSortedNumber}]`)
                    }));
                } else {
                    // report error
                    report(shortcut.node, new RuleError(`Should use use incremental number for identifier`));
                    if (pairDefinition) {
                        report(pairDefinition.node, new RuleError(`Should use use incremental number for definition`));
                    }
                }
            });
        }
    };
};

module.exports = {
    linter: report,
    fixer: report
};
