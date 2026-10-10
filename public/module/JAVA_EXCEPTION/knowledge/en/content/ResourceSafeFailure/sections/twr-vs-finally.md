Manual cleanup:

```java
InputStream in = Files.newInputStream(path);
try {
    return in.read();
} finally {
    in.close();
}
```

looks simple until:

```text
body throws A
and
close throws B
```

With manual `finally`, B can hide A unless the code carefully preserves both.

TWR defines standard semantics that keep the primary failure and attach cleanup failures as suppressed exceptions.

### Comparison

```text
manual finally
→ manually manage nulls, close order, multiple resources, multiple failures

try-with-resources
→ ownership is visible in syntax
→ close order is defined
→ partial initialization is cleaned up
→ primary/suppressed failure semantics are preserved
```

TWR does not replace every use of `finally`. `finally` remains useful for exit work that is not naturally an `AutoCloseable` lifecycle. But for owned resources, TWR is usually the better default.

### REMEMBER

```text
resource specification
→ explicit ownership/lifecycle

initialization
→ left to right

closing
→ right to left

mid-initialization failure
→ earlier successful resources are still closed

body + close both fail
→ suppressed-exception semantics are required
```

The next part examines that final case: when the operation and cleanup both fail, how does Java preserve both failures?

Cleanup can fail too. Resource management therefore has a difficult case:

```text
the main operation already failed
        +
cleanup also fails
        ↓
do not lose either failure
```

Try-with-resources solves this with **primary** and **suppressed** exceptions.
