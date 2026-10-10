Most composition bugs come from reading names instead of tracing data. A reliable mental model is to write the value flow explicitly.

```text
input
  -> trim
  -> parse
  -> validate
  -> result
```

Then choose APIs that preserve that flow. With `Function`, `andThen` reads left-to-right, while `compose` names the later function first.

Types provide an additional safety check. If one function returns `Integer`, the next function must accept `Integer` or a compatible type. Compilation can catch many ordering mistakes, but it cannot tell whether a semantically valid order is the one your business rule intended.
