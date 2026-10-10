When the target function type returns a value, the referenced method must produce a compatible result. When the target returns `void`, Java may invoke a compatible method and discard its result.

```java
Function<String, String> trimAndKeep = String::trim;
Consumer<String> trimAndDiscard = String::trim;
```

Both can invoke `String.trim()`. The `Function` keeps the returned `String`; the `Consumer` ignores it.

Discarding a result can be legal yet misleading. A `Consumer` that calls a value-returning method may make readers wonder whether the result was accidentally lost, so use this adaptation only when the side effect or invocation itself is clearly the purpose.
