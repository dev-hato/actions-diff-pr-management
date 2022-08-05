const chevrotain = require(`chevrotain`);

const createToken = chevrotain.createToken;
const tokenMatcher = chevrotain.tokenMatcher;
const Lexer = chevrotain.Lexer;
const EmbeddedActionsParser = chevrotain.EmbeddedActionsParser;

module.exports = queryPattern => {
  const LogicalOperator = createToken({name: `LogicalOperator`, pattern: Lexer.NA});
  const Or = createToken({name: `Or`, pattern: /\|/, categories: LogicalOperator});
  const Xor = createToken({name: `Xor`, pattern: /\^/, categories: LogicalOperator});
  const And = createToken({name: `And`, pattern: /&/, categories: LogicalOperator});
  
  const Not = createToken({name: `Not`, pattern: /!/});
  const LParen = createToken({name: `LParen`, pattern: /\(/});
  const RParen = createToken({name: `RParen`, pattern: /\)/});
  const Query = createToken({name: `Query`, pattern: queryPattern});
  
  const WhiteSpace = createToken({
    name: `WhiteSpace`,
    pattern: /\s+/,
    group: Lexer.SKIPPED
  });
  
  const allTokens = [WhiteSpace, Or, Xor, And, LParen, RParen, Not, LogicalOperator, Query];
  const TinylogicLexer = new Lexer(allTokens);
  
  class TinylogicParser extends EmbeddedActionsParser {
    constructor(regex) {
      super(allTokens);
  
      this.RULE(`expression`, () => {
        return this.SUBRULE(this.logicalExpression);
      });
  
      this.RULE(`logicalExpression`, () => {
        const left = this.SUBRULE(this.atomicExpression);
  
        let value = left;
        this.MANY(() => {
          const current = value;

          const op = this.CONSUME(LogicalOperator);
          const right = this.SUBRULE2(this.atomicExpression);
  
          if (tokenMatcher(op, Or)) {
            value = fn => current(fn) || right(fn);
          } else if (tokenMatcher(op, Xor)) {
            value = fn => !!(current(fn) ^ right(fn));
          } else {
            value = fn => current(fn) && right(fn);
          }
        });
  
        return value;
      });
  
      this.RULE(`atomicExpression`, () => this.OR([
        {ALT: () => this.SUBRULE(this.parenthesisExpression)},
        {ALT: () => {
          const {image} = this.CONSUME(Query);
          return fn => fn(image);
        }},
        {ALT: () => {
          this.CONSUME(Not);
          const expr = this.SUBRULE(this.atomicExpression);
          return fn => !expr(fn);
        }},
      ]));
  
  
      this.RULE(`parenthesisExpression`, () => {
        let expValue;
  
        this.CONSUME(LParen);
        expValue = this.SUBRULE(this.expression);
        this.CONSUME(RParen);
  
        return expValue;
      });
  
      this.performSelfAnalysis();
    }
  }  

  return {
    TinylogicLexer,
    TinylogicParser,
  };
};
