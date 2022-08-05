"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasProxy = exports.bootstrap = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const global_agent_1 = require("global-agent");
const envVars = ['HTTP_PROXY', 'HTTPS_PROXY', 'NO_PROXY'];
let agent = false;
function bootstrap() {
    envVars.forEach((envVar) => {
        /* istanbul ignore if: env is case-insensitive on windows */
        if (typeof process.env[envVar] === 'undefined' &&
            typeof process.env[envVar.toLowerCase()] !== 'undefined') {
            process.env[envVar] = process.env[envVar.toLowerCase()];
        }
        if (process.env[envVar]) {
            process.env[envVar.toLowerCase()] = process.env[envVar];
        }
    });
    if (is_1.default.nonEmptyString(process.env.HTTP_PROXY) ||
        is_1.default.nonEmptyString(process.env.HTTPS_PROXY)) {
        (0, global_agent_1.createGlobalProxyAgent)({
            environmentVariableNamespace: '',
        });
        agent = true;
    }
    else {
        // for testing only, does not reset global agent
        agent = false;
    }
}
exports.bootstrap = bootstrap;
// will be used by our http layer later
function hasProxy() {
    return agent === true;
}
exports.hasProxy = hasProxy;
//# sourceMappingURL=proxy.js.map