This is first of all **Java language/closure semantics**, not because the JVM "forces the local variable to be thread-safe".

Valid examples:

```java
int taskId = i;
executor.execute(() -> use(taskId));
```

If `taskId` are not reassigned after initialization.

Lambda captures the value/reference of the local variable according to the effectively-final rule to avoid ambiguous semantics of the mutable local stack variable after the enclosing method continues/exits.

That doesn't make the captured object immutable:

```java
final List<String> list = new ArrayList<>();
```

The reference remains unchanged, but the list content is still mutable.
