`length()` is the current UTF-16 code-unit count, following the same indexing model as `String.length()`. `capacity()` is the current internal buffer capacity before growth is required.

Capacity is a performance concern rather than part of text semantics. Pre-sizing can reduce resizing when a large final size is reasonably predictable.

### Capacity is not a maximum length

```java
StringBuilder b = new StringBuilder(8);
b.append("this text is longer than eight");
```

The builder grows when needed. Initial capacity is a performance hint, not a maximum-length contract.

The exact growth strategy is an implementation detail. `ensureCapacity(n)` can help when a large lower bound is known, but it should be driven by a real workload or measurement.

### setLength deserves care

`setLength` can truncate or extend a builder. When extending it, the new positions contain the null character (`\u0000`), not spaces. It is not a “pad with spaces” API.

The next chapter compares `StringBuilder` with synchronized `StringBuffer`.
