Some ambiguous/nested quantifier patterns can generate enormous backtracking on adversarial input.

Risky shape:

```regex
(a+)+$
```

A long near-match that fails at the end can force the engine to explore many partitions before concluding.

For untrusted input:

- keep patterns simple;
- bound input where appropriate;
- avoid known catastrophic-backtracking structures;
- test worst cases rather than only successful examples.

Also consider:

- reuse a compiled `Pattern` when the same regex runs repeatedly;
- use a parser/state machine when the grammar is beyond regex's useful scope;
- place input-size/time boundaries around untrusted large input at the application layer;
- review nested quantifiers and overlapping alternatives carefully.

Regex is powerful, but it is not the right parser for every complex grammar.

The final chapter changes source-code syntax for multiline text, not the runtime String type.
