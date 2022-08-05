"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToString = void 0;
const stream_1 = require("stream");
async function streamToString(stream) {
    const readable = stream_1.Readable.from(stream);
    const chunks = [];
    const p = await new Promise((resolve, reject) => {
        readable.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        readable.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        readable.on('error', (err) => reject(err));
    });
    return p;
}
exports.streamToString = streamToString;
//# sourceMappingURL=streams.js.map