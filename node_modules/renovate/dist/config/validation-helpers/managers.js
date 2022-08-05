"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const manager_1 = require("../../modules/manager");
/**
 * Only if type condition or context condition violated then errors array will be mutated to store metadata
 */
function check({ resolvedRule, currentPath, }) {
    let managersErrMessage;
    if (Array.isArray(resolvedRule.matchManagers)) {
        if (resolvedRule.matchManagers.find((confManager) => !(0, manager_1.getManagerList)().includes(confManager))) {
            managersErrMessage = `${currentPath}:
        You have included an unsupported manager in a package rule. Your list: ${String(resolvedRule.matchManagers)}.
        Supported managers are: (${(0, manager_1.getManagerList)().join(', ')}).`;
        }
    }
    else if (typeof resolvedRule.matchManagers !== 'undefined') {
        managersErrMessage = `${currentPath}: Managers should be type of List. You have included ${typeof resolvedRule.matchManagers}.`;
    }
    return managersErrMessage
        ? [
            {
                topic: 'Configuration Error',
                message: managersErrMessage,
            },
        ]
        : [];
}
exports.check = check;
//# sourceMappingURL=managers.js.map