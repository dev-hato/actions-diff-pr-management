"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitMessageFactory = void 0;
const custom_commit_message_1 = require("./custom-commit-message");
const semantic_commit_message_1 = require("./semantic-commit-message");
class CommitMessageFactory {
    constructor(config) {
        this._config = config;
    }
    create() {
        const message = this.areSemanticCommitsEnabled
            ? this.createSemanticCommitMessage()
            : this.createCustomCommitMessage();
        return message;
    }
    createSemanticCommitMessage() {
        const message = new semantic_commit_message_1.SemanticCommitMessage();
        message.type = this._config.semanticCommitType ?? '';
        message.scope = this._config.semanticCommitScope ?? '';
        return message;
    }
    createCustomCommitMessage() {
        const message = new custom_commit_message_1.CustomCommitMessage();
        message.prefix = this._config.commitMessagePrefix ?? '';
        return message;
    }
    get areSemanticCommitsEnabled() {
        return (!this._config.commitMessagePrefix &&
            this._config.semanticCommits === 'enabled');
    }
}
exports.CommitMessageFactory = CommitMessageFactory;
//# sourceMappingURL=commit-message-factory.js.map