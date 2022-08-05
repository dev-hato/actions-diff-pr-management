import type { TextlintRuleModule, TextlintRuleReporter } from "@textlint/types";
import { TextlintRuleNoZeroWidthSpacesError } from "./TextlintRuleNoZeroWidthSpacesError";

const reporter: TextlintRuleReporter = (context) => {
  const { fixer, getSource, report, RuleError, Syntax } = context;

  return {
    async [Syntax.Str](node) {
      const text = getSource(node);

      [...text.matchAll(/\u200b/g)].forEach((match) => {
        if (match.index === undefined) {
          throw new TextlintRuleNoZeroWidthSpacesError();
        }

        const ruleError = new RuleError("Zero width space is disallowed.", {
          index: match.index,
          fix: fixer.replaceTextRange(
            [match.index, match.index + "\u200b".length],
            ""
          ),
        });

        report(node, ruleError);
      });
    },
  };
};

const module: TextlintRuleModule = {
  fixer: reporter,
  linter: reporter
};

export default module;
