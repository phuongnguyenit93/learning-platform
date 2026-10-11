Several synchronized methods do not make a larger read-decide-write sequence atomic.

Another thread may interleave between calls unless the caller establishes a wider synchronization boundary.

Example:

```java
if (buffer.length() < 100) {
    buffer.append(part);
}
```

`length()` and `append()` may each be synchronized, but the caller's check-then-act sequence contains **two operations**. Another thread can change the buffer between them.

If the invariant covers:

```text
read state
→ decide
→ mutate
```

the synchronization boundary must cover the whole sequence, or the design should avoid the shared mutable buffer.

Thread safety must therefore be evaluated at the **use-case operation boundary**, not only by inspecting individual synchronized methods.

Locks, concurrency primitives, and the Java Memory Model belong to the dedicated concurrency curriculum; this chapter stops at the StringBuffer API boundary.

The next chapter returns to the pool and explicit canonicalization through `String.intern()`.
