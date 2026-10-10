A business concern is the core logic of a use case, for example creating an order or canceling an order.

A cross-cutting concern is behavior that appears in many places but is not the main business logic, for example:

- logging;
- timing;
- auditing;
- tracing;
- authorization checks.

If every business method writes its own logging, the code is easily duplicated:

```text
createOrder()
→ log before
→ business logic
→ log after

cancelOrder()
→ log before
→ business logic
→ log after
```

AOP lets us extract that repeated behavior into an Aspect:

```text
LoggingAspect
        ↓
createOrder()
cancelOrder()
```

The important point is that AOP does not make business logic disappear. It only places cross-cutting behavior at an appropriate boundary.
