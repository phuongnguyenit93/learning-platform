Do not include passwords, tokens, secrets, full payment data, or other sensitive values simply because they are fields on the object.

Avoid designs such as:

```java
@Override
public String toString() {
    return "LoginRequest[user=" + user
            + ", password=" + password + "]";
}
```

### WHY IS THE EXPOSURE SURFACE LARGE?

`toString` output may surface through:

- logging;
- string concatenation;
- IDEs/debuggers;
- assertions and test failures;
- exception messages;
- nested collection/object representations.

A sensitive field added to `toString` can therefore reach production logs even when a developer never explicitly called the method at that location.

### REDACTION AND SAFE REPRESENTATION

When some identification is useful, expose a masked or reduced value:

```java
@Override
public String toString() {
    return "PaymentCard[last4=" + last4 + "]";
}
```

Detailed security policy belongs in a security-focused module, but the boundary here is clear: **`toString` is a diagnostic surface, not permission to expose all object state**.

The final two chapters move to a different object contract: **ordering** — which object comes first, and who owns that policy.
