'use strict';

export default function(context, options = {}) {
  const words = options.words || [];

  let {Syntax, getSource, report, RuleError} = context;

  return {
    [Syntax.Document](node) {
      return new Promise((resolve, reject) => {
        const text = getSource(node);

        words.forEach(word => {
          if (text.indexOf(word) !== -1) {
            report(node, new RuleError(`Document contains NG word "${word}".`));
          }
        });

        resolve();
      });
    }
  }
}
