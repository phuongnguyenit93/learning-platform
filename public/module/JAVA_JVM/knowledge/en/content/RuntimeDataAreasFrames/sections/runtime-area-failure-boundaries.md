Runtime areas are backed by finite resources, so the JVM model defines important failure boundaries.

`StackOverflowError` commonly occurs when a thread needs additional stack/frame capacity beyond what can be provided:

```java
static void recurse() {
    recurse();
}
```

`OutOfMemoryError` is broader than “the Java heap is full.” It can represent failure to obtain memory for heap or other runtime structures/resources.

The practical rule is:

```text
error type/message
≠ complete production root cause
```

The JVM module explains the mechanism; heap dumps, NMT, JFR, and evidence-driven root-cause analysis belong to Runtime Diagnostics.
