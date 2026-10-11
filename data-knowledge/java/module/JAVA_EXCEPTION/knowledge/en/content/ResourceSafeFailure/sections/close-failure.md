There are three useful cases.

### Case 1 — body succeeds, close fails

```text
body succeeds
→ close throws B
→ B becomes the primary exception
```

The overall operation fails because resource cleanup did not complete successfully.

### Case 2 — body fails, close fails

```text
body throws A
→ close throws B
→ A is primary
→ B is suppressed on A
```

### Case 3 — multiple closes fail, body succeeds

For:

```text
A opened first
B opened later
```

the close order is:

```text
B → A
```

If both closes throw:

```text
B close failure
→ primary close failure

A close failure
→ suppressed on B's failure
```

The first failure encountered during closing becomes primary when there was no earlier body failure; later close failures are preserved as suppressed.

### Why manual cleanup is easy to get wrong

```java
try {
    use();
} finally {
    close(); // may replace the failure from use()
}
```

Reproducing TWR's behavior correctly for multiple resources, partial initialization, and multiple close failures is non-trivial.

Suppression is therefore not an obscure API detail. It exists to solve a concrete failure-preservation problem.

### REMEMBER

```text
cause
→ causal / translation chain

suppressed
→ additional failure preserved without replacing the primary failure

try-with-resources
→ manages cleanup suppression semantics automatically
```

Before leaving try-with-resources, the final part covers a Java 9 syntax convenience: using an existing `final` or effectively-final variable directly as a resource.
