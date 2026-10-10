Suppose the body throws A:

```java
try (DemoResource resource = new DemoResource()) {
    throw new IllegalArgumentException("body failed");
}
```

and `resource.close()` also throws B.

TWR preserves:

```text
A
→ primary exception

B
→ suppressed exception attached to A
```

### WHY KEEP A AS PRIMARY?

The operation already failed because of A. If cleanup failure B replaced it, diagnostics would report:

```text
"close failed"
```

while losing the failure that explains **why the main operation failed**.

Suppression preserves the full picture:

```text
primary
→ failure that determines the main outcome

suppressed
→ additional failure that occurred during cleanup
  while another failure was already primary
```

### Observable example

```java
final class DemoResource implements AutoCloseable {
    @Override
    public void close() {
        throw new IllegalStateException("close failed");
    }
}

try (DemoResource resource = new DemoResource()) {
    throw new IllegalArgumentException("body failed");
}
```

An outer catch can inspect:

```java
catch (Exception ex) {
    System.out.println(ex.getMessage());

    for (Throwable suppressed : ex.getSuppressed()) {
        System.out.println("suppressed: " + suppressed.getMessage());
    }
}
```

Conceptually:

```text
primary   = IllegalArgumentException("body failed")
suppressed[0]
          = IllegalStateException("close failed")
```

This is direct evidence for why TWR preserves failure information better than naive manual cleanup.
