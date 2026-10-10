This is where `finally` can become dangerous.

### A return value is prepared, then finally runs before the method exits

```java
int value() {
    try {
        return 1;
    } finally {
        System.out.println("cleanup");
    }
}
```

The result is still `1`, but cleanup executes before the caller receives it.

### A return in finally replaces a pending return

```java
int dangerous() {
    try {
        return 1;
    } finally {
        return 2;
    }
}
```

The result is `2`.

Flow:

```text
try prepares return 1
        ↓
finally runs
        ↓
finally creates a new return 2
        ↓
return 1 is discarded
```

A `return` in `finally` is even more dangerous when an exception is already pending:

```java
int dangerous() throws IOException {
    try {
        throw new IOException("original");
    } finally {
        return 0;
    }
}
```

The method returns `0`; the pending `IOException` is replaced by the new completion reason from `finally`.

### A throw from finally can hide the original exception

```java
try {
    throw new IllegalStateException("original");
} finally {
    throw new RuntimeException("cleanup failed");
}
```

The cleanup failure escapes, while the original failure may be lost under manual cleanup semantics.

The general rule is that if `finally` itself **completes abruptly** through `return`, `throw`, or a context-valid `break`/`continue`, that new completion reason replaces the pending result or exception from `try`/`catch`.

This is one reason try-with-resources is safer: it preserves cleanup failures as **suppressed exceptions** instead of blindly replacing the primary failure.

Practical rule:

```text
finally
→ cleanup

avoid
→ return from finally
→ introducing a new cleanup failure when a safer resource mechanism exists
```

### REMEMBER

```text
try
→ region that may complete abruptly

catch
→ a concrete failure policy

multi-catch
→ multiple types with one genuinely shared policy

finally
→ exit cleanup
```

The next chapter replaces manual resource cleanup with try-with-resources, where resource lifecycle and ownership become explicit in the syntax.
