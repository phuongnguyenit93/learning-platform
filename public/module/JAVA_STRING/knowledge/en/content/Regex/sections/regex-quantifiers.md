Quantifiers such as `*`, `+`, and `{m,n}` are typically greedy by default: they consume as much as possible and backtrack when necessary.

Reluctant forms such as `*?` and `+?` begin with less and expand when needed.

Java also supports **possessive quantifiers** such as `*+` and `++`, which do not backtrack the consumed portion. They can control backtracking when the semantics fit, but they are not a drop-in “faster greedy” replacement.

The difference matters when several match boundaries are possible. Always reason about a pattern together with representative input.

Example:

```text
input: <a><b>

<.*>
→ greedy, can consume <a><b>

<.*?>
→ reluctant, first match can be <a>
```
