Suppose two `@Around` Aspects match the same target:

```text
Aspect A @Order(1)
Aspect B @Order(2)
```

With the current precedence, the Aspect with the lower order wraps the outside of the call chain:

```text
A before
    B before
        target
    B after
A after
```

The exit order is reversed because this is a nested invocation, not four independent callbacks executed in a flat sequence.

`@Order`/precedence must be explicit if correctness depends on ordering. If two advice methods match without a clear precedence contract, **do not treat the log order observed in one execution as a guarantee**.
