Traditional JVM invocation instructions such as `invokevirtual` and `invokestatic` describe a relatively direct symbolic target. `invokedynamic` exposes a different extension point: **bootstrap logic decides how the call site is linked**.

```text
invokedynamic
→ JVM invokes a bootstrap method when the call site must be linked
→ bootstrap returns a CallSite
→ subsequent calls dispatch through that CallSite
```

This lets language runtimes and JDK runtime libraries implement custom invocation semantics without requiring a new JVM instruction for every language feature.

Ordinary Java source rarely emits invokedynamic directly. The compiler/runtime may use it for features such as lambdas or modern string concatenation. This chapter teaches the runtime mechanism, not class-file generation.
