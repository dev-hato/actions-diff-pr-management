"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistryFlavor = void 0;
// eslint-disable-next-line typescript-enum/no-enum
var RegistryFlavor;
(function (RegistryFlavor) {
    /** https://crates.io, supports rawgit access */
    RegistryFlavor[RegistryFlavor["CratesIo"] = 0] = "CratesIo";
    /** https://cloudsmith.io, needs git clone */
    RegistryFlavor[RegistryFlavor["Cloudsmith"] = 1] = "Cloudsmith";
    /** unknown, assuming private git repository */
    RegistryFlavor[RegistryFlavor["Other"] = 2] = "Other";
})(RegistryFlavor = exports.RegistryFlavor || (exports.RegistryFlavor = {}));
//# sourceMappingURL=types.js.map