A `Throwable` commonly carries four important pieces of information:

- **type** — the failure category, such as `IOException`;
- **message** — descriptive context;
- **stack trace** — call frames that help identify the execution path;
- **cause** — a lower-level throwable that led to the current one.

To observe the `cause` relationship without introducing custom exceptions yet, use a familiar wrapper:

```java
try {
    return repository.load(orderId);
} catch (IOException ex) {
    throw new RuntimeException("Cannot load order " + orderId, ex);
}
```

Conceptually:

```text
RuntimeException
message = Cannot load order 42
cause
  ↓
IOException
message = connection reset
```

`RuntimeException` is used here only to demonstrate the `cause` structure, not to recommend wrapping every `IOException` in `RuntimeException`. Custom exception design and translation decisions are covered later.

The causal chain can be traversed:

```java
Throwable current = ex;

while (current != null) {
    System.out.println(current.getClass().getSimpleName()
            + ": " + current.getMessage());
    current = current.getCause();
}
```

### What does a stack trace tell us?

A stack trace usually shows a path like:

```text
where the Throwable recorded its stack
        ↓
current method
        ↓
caller
        ↓
caller's caller
```

It is diagnostic data, not a stable business API to parse as text. Refactoring can change method names, line numbers, and frames.

Also avoid reusing a single exception instance as a global “error constant”. A throwable usually records stack information when it is created or when its stack is filled, so reusing the same instance can produce misleading diagnostics.

### REMEMBER

```text
Throwable
= diagnostic object
+ control-flow signal
```

The next chapter asks which failures the compiler turns into a mandatory caller-facing contract.
