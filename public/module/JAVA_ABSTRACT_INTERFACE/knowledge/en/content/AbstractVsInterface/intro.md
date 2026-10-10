# Choosing an Abstract Class or an Interface

There is no rule that interfaces are always better than abstract classes or vice versa. The mechanisms solve overlapping but distinct design needs. The choice should begin with **the relationship being modeled**, not a syntax preference.

Return to the payment example:

```text
PaymentMethod
→ every payment implementation must provide pay(...)

BasePayment
→ some payment implementations share provider state, validation, and base behavior

Refundable
→ only payment types supporting refunds need this capability
```

Those needs should not be forced into one mechanism. A consumer-facing contract, reusable base implementation, and optional capability are different responsibilities.
