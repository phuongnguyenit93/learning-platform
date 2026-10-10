`finally` is designed for work that should happen when control leaves `try/catch`.

```java
try {
    useResource();
} finally {
    cleanup();
}
```

In normal JVM control flow it typically runs when the exit path is:

- normal completion;
- a handled exception;
- a propagating exception;
- `return`;
- relevant `break` or `continue`.

Mental model:

```text
try/catch determines the pending outcome
        ↓
before control actually leaves the construct
        ↓
finally executes
```

### `finally` is not a physical-world guarantee

“Finally always runs” should not be interpreted absolutely. Forced process/JVM termination, crashes, or external power loss can prevent cleanup code from running.

Within ordinary language-level control flow, `finally` is Java's construct for mandatory exit work.

### Prefer try-with-resources for owned resources

Manual cleanup traditionally looks like:

```java
InputStream in = null;
try {
    in = Files.newInputStream(path);
    ...
} finally {
    if (in != null) {
        in.close();
    }
}
```

This becomes subtle when the body and `close()` both fail. For `AutoCloseable` resources, try-with-resources usually models ownership more safely and clearly.
