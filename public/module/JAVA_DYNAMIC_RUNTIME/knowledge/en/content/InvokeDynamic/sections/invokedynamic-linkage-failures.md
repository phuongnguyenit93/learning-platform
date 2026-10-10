The CallSite returned by bootstrap must match the invokedynamic instruction's descriptor.

Failure semantics need one important distinction:

- if bootstrap throws an `Error` or subclass of `Error`, that error itself becomes the resolution failure;
- if bootstrap throws a non-`Error` `Throwable`, the JVM wraps it in `BootstrapMethodError` and preserves the original throwable as the cause;
- if bootstrap returns `null`, returns a non-`CallSite` object, or returns a `CallSite` whose type does not match the instruction descriptor, resolution fails with `BootstrapMethodError`.

For the same `invokedynamic` instruction, once resolution has failed, later executions observe the same resolution error and the bootstrap is not re-executed for that instruction.

Useful debugging flow:

```text
invokedynamic failure
→ what is the call-site MethodType?
→ what name/type reached bootstrap?
→ what is target.type() before adaptation?
→ what is the returned CallSite.type()?
→ if this is BootstrapMethodError, what is its original cause?
→ if this is another Error, which error escaped bootstrap/resolution directly?
```

`BootstrapMethodError` is normally a linkage/programming/configuration problem, not a business exception to recover from.
