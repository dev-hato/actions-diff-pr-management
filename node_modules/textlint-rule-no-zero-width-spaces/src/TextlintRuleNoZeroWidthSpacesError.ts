class TextlintRuleNoZeroWidthSpacesError extends Error {
  constructor(...args: any[]) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TextlintRuleNoZeroWidthSpacesError);
    }

    this.name = "TextlintRuleNoZeroWidthSpacesError";
  }
}

export { TextlintRuleNoZeroWidthSpacesError };
