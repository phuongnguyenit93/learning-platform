API:

```java
Throwable[] suppressed = ex.getSuppressed();
```

A throwable may contain **multiple** suppressed failures.

With three resources:

```text
A opened first
B opened next
C opened last
```

closing runs:

```text
C → B → A
```

If the body already failed and both `C.close()` and `A.close()` fail:

```text
body failure
→ primary

C close failure
→ suppressed

A close failure
→ suppressed
```

The diagnostic order follows the cleanup failures as they are encountered.

### Suppressed is not the same as Cause

They answer different questions:

```text
cause
→ which lower-level failure led to this exception
  through causal/abstraction chaining?

suppressed
→ which additional failure occurred while another
  failure was already the primary outcome?
```

Example:

```text
RuntimeException
cause
└── IOException

IOException
suppressed
└── close failure
```

A throwable can have both a cause and suppressed failures.

> Advanced detail: a `Throwable` subclass can disable suppression through `Throwable`'s protected constructor. In that unusual case, suppressed failures are not recorded. This matters mainly to library authors; ordinary exceptions use the normal suppression-enabled model.

### Should business logic depend on suppressed failures?

Usually not.

Suppressed exceptions are primarily **diagnostic context**. Business policy should normally rely on stable types and structured contract data rather than rules such as “do X when exactly two suppressed failures exist”.
