An interface may extend multiple interfaces:

```java
interface AuditedPayment extends Payable, Auditable { ... }
```

This is multiple inheritance of **types/contracts**. Interfaces contribute no per-instance fields or object state, and this is not multiple class inheritance.

Compatible abstract signatures compose naturally. If return types conflict and cannot be satisfied simultaneously, the child interface can be invalid at compile time.

Conflicts involving `default` methods are deferred to the later milestones after the role of `default` has been established.
