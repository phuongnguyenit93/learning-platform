# Acting Dynamically from Metadata

The previous three chapters **discovered** `Field`, `Method`, and `Constructor` descriptors and their metadata. This milestone now uses those selected descriptors to actually **read/write state, invoke behavior, and create objects**. When metadata selects an operation at runtime, the compiler no longer performs the entire type-checking, overload-selection, or argument-shaping job for the caller.

With a direct call:

```java
String result = service.pay(request);
```

the compiler knows `PaymentService`, knows the `pay(PaymentRequest)` signature, and can reject a wrong type immediately. With reflective invocation, code often receives a class, name, or signature from metadata/configuration and must resolve the member before invoking it.
