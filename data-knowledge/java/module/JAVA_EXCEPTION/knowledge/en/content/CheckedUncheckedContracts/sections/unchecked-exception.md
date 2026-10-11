Unchecked exceptions are not subject to the catch-or-declare rule.

The two major groups are:

```text
RuntimeException and subclasses
Error and subclasses
```

In application code, “unchecked exception” most often refers to the `RuntimeException` branch:

- `NullPointerException`;
- `IllegalArgumentException`;
- `IllegalStateException`;
- `IndexOutOfBoundsException`.

Example:

```java
void withdraw(long amount) {
    if (amount < 0) {
        throw new IllegalArgumentException("amount must be >= 0");
    }
}
```

The method is not required to declare:

```java
void withdraw(long amount) throws IllegalArgumentException
```

Declaring an unchecked exception in `throws` is legal, but the compiler does not require it.

### Unchecked does not mean unimportant

Unchecked only means:

```text
compiler
→ does not force callers to catch or declare it
```

It does not mean:

```text
runtime
→ the failure can be ignored
```

A `NullPointerException` can still fail a request or job. The difference is that every caller is not forced to express a compile-time decision.

Unchecked exceptions are often a good fit for:

- violated preconditions;
- invalid object state;
- programming errors;
- failures that nearby callers do not have a sensible recovery strategy for.
