A resource used in TWR must have a type that implements `AutoCloseable`:

```java
public interface AutoCloseable {
    void close() throws Exception;
}
```

Example:

```java
try (InputStream in = Files.newInputStream(path)) {
    return in.read();
}
```

Basic flow:

```text
create resource
        ↓
execute body
        ↓
leave by success / return / throw
        ↓
Java invokes close()
        ↓
control continues outside
```

### WHY NOT WAIT FOR THE GARBAGE COLLECTOR?

A stream object may become unreachable while the underlying OS resource still needs deterministic release.

Mental model:

```text
memory lifetime
≠
external resource lifetime
```

TWR solves **lifecycle/ownership**, not GC optimization.

### Where do catch and finally fit?

```java
try (InputStream in = Files.newInputStream(path)) {
    use(in);
} catch (IOException ex) {
    handle(ex);
} finally {
    afterOperation();
}
```

Resources are closed when leaving the resource `try` **before** the `catch` and `finally` clauses attached to that try-with-resources statement begin handling the outcome.

Therefore, when a `catch` receives the exception, cleanup of resources owned by the try-with-resources statement has already run.

### What if a resource is null?

A try-with-resources resource may evaluate to `null`. This is legal:

```java
void useNullableResource() throws Exception {
    try (AutoCloseable resource = null) {
        // ...
    }
}
```

When leaving the `try`, Java invokes `close()` only when the resource is non-null. This is part of TWR semantics, not a reason to design around null resources; normal code should still keep ownership and resource state explicit.
