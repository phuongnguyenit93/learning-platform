Anti-pattern:

```java
try {
    run();
} catch (Exception ex) {
    // ignored
}
```

Outer code may continue as though the operation succeeded even though the expected state was never reached.

Result:

```text
failure occurs
→ signal is erased
→ caller observes false success
→ later bug appears far from the original cause
```

### Intentional ignore is different from accidental swallowing

Sometimes a specific failure is genuinely harmless:

```java
try {
    deleteTemporaryFile();
} catch (NoSuchFileException ex) {
    // the file is already absent; desired outcome is satisfied
}
```

The difference is:

- specific type;
- explicit reason;
- resulting state is still valid;
- narrow scope.

An empty `catch (Exception)` is not a substitute for that reasoning.
