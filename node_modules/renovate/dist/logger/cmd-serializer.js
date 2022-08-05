"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// istanbul ignore next
function cmdSerializer(cmd) {
    if (typeof cmd === 'string') {
        return cmd.replace(/https:\/\/[^@]*@/g, 'https://**redacted**@'); // TODO #12874
    }
    return cmd;
}
exports.default = cmdSerializer;
//# sourceMappingURL=cmd-serializer.js.map