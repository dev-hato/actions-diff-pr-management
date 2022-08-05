#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = require("./logger");
const proxy = tslib_1.__importStar(require("./proxy"));
const globalWorker = tslib_1.__importStar(require("./workers/global"));
// istanbul ignore next
process.on('unhandledRejection', (err) => {
    logger_1.logger.error({ err }, 'unhandledRejection');
});
proxy.bootstrap();
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    process.exitCode = await globalWorker.start();
    // istanbul ignore if
    if (process.env.RENOVATE_X_HARD_EXIT) {
        process.exit(process.exitCode);
    }
})();
//# sourceMappingURL=renovate.js.map