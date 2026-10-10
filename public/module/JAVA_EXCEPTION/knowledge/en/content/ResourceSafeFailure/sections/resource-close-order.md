Resources are initialized left to right:

```java
try (A a = openA();
     B b = openB();
     C c = openC()) {
    use(a, b, c);
}
```

Initialization:

```text
A → B → C
```

Closing is reversed:

```text
C → B → A
```

### WHY REVERSE THE ORDER?

Later resources often depend on earlier resources.

For example:

```java
try (InputStream raw = Files.newInputStream(path);
     BufferedInputStream buffered = new BufferedInputStream(raw)) {
    ...
}
```

`buffered` wraps `raw`, so the wrapper should be closed first. Many wrappers also close their wrapped resource from `close()`, however, so whether both resources belong in the same try-with-resources declaration depends on actual ownership; do not create accidental double-close responsibility.

### What if initialization fails in the middle?

Important edge case:

```java
try (A a = openA();
     B b = openB();   // throws here
     C c = openC()) {
    ...
}
```

Result:

```text
A initialized successfully
B initialization fails
C is never created
        ↓
A is still closed
```

TWR cleans resources that were successfully initialized before the failure point. If initializing B throws and `A.close()` also throws, B's initialization failure remains primary and the close failure from A is suppressed.

A further nuance: if `openB()` internally acquires something and then fails **before returning the B object**, TWR never obtains ownership of B and therefore cannot call `B.close()`. The factory/constructor creating B is responsible for cleaning up any partial acquisition before it throws.

Doing this correctly with several nested manual `try/finally` blocks is much harder.
