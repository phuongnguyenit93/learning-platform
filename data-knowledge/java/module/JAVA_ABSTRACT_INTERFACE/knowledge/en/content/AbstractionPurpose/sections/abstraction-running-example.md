The module keeps one model consistent across chapters:

```text
PaymentMethod
→ interface describing the payment contract

BasePayment
→ abstract class holding shared state and partial implementation

CardPayment
→ concrete class completing the behavior

Refundable
→ interface describing an independent capability
```

The same example will show why contracts and shared implementation are different responsibilities, how interfaces inherit from one another, and what happens when inherited defaults conflict.
