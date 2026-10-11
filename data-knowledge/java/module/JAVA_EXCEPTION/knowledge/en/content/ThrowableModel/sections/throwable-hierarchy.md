### CONCEPT

`Throwable` is the root type of Java's exception mechanism. A simplified hierarchy is:

```text
Throwable
├── Error
└── Exception
    └── RuntimeException
```

Any value used by a `throw` statement must be compatible with `Throwable`. A throwable plays two roles at once:

```text
control-flow signal
→ normal execution is interrupted

diagnostic object
→ carries type, message, stack trace, cause, and possibly suppressed failures
```

That is why an exception is more than “an error object”. Throwing it also changes control flow.

### Where do checked and unchecked fit?

A useful compile-time classification is:

```text
Throwable
├── Error                         → unchecked
└── Exception
    ├── RuntimeException          → unchecked
    └── other Exception types     → checked
```

More precisely, subclasses of `RuntimeException` and `Error` are not subject to the checked catch-or-declare rule. Every other `Throwable` class is checked by the language rules, including the unusual case of a class that extends `Throwable` directly instead of extending `Exception`.

Ordinary application exceptions should normally extend `Exception` or `RuntimeException` rather than subclassing `Throwable` directly; the diagram intentionally focuses on the hierarchy learners encounter in normal code.

This matters because “unchecked” is broader than just `RuntimeException`; `Error` is unchecked as well.

### MECHANISM

When this executes:

```java
throw new IllegalStateException("order state is invalid");
```

normal execution stops at the `throw`. Java does not execute the next statement in that block. It begins looking for a compatible handler, and if the current method does not handle the failure, it propagates upward.

Propagation gets its own chapter later.
