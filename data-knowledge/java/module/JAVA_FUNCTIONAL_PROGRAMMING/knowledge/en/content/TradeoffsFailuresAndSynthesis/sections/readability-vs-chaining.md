Functional APIs make chaining easy, but a chain is readable only while the reader can still understand the data shape, failure behavior, and purpose of each step.

Watch for warning signs:

- several unrelated responsibilities inside one chain;
- nested lambdas whose parameters are difficult to track;
- repeated conversion between wrappers only to keep chaining;
- hidden side effects in operations that look like transformations;
- steps whose names do not explain the business meaning.

Extract a named method, introduce an intermediate variable, or use an ordinary control-flow statement when it makes the logic easier to verify. Fewer lines are not automatically simpler code.
