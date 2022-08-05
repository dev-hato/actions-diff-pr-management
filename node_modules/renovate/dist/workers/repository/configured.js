"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfConfigured = void 0;
const error_messages_1 = require("../../constants/error-messages");
function checkIfConfigured(config) {
    if (config.enabled === false) {
        throw new Error(error_messages_1.REPOSITORY_DISABLED_BY_CONFIG);
    }
    if (config.isFork && !config.includeForks) {
        throw new Error(error_messages_1.REPOSITORY_FORKED);
    }
}
exports.checkIfConfigured = checkIfConfigured;
//# sourceMappingURL=configured.js.map