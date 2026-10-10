Dynamic invocation is justified when the **target genuinely becomes known only at runtime**. Common examples include:

- a framework choosing a handler from annotation or routing metadata;
- a serializer/deserializer selecting an accessor or constructor from a model class;
- a plugin system loading an implementation and invoking a discovered contract;
- testing/tooling that must inspect and call code by runtime name/signature.

If application code already knows it always needs `PaymentService.pay(PaymentRequest)`, a direct call is simpler, type-safe, and easier to refactor.

When dynamic invocation is a real requirement, contain it behind a controlled adapter:

```java
final class PaymentInvoker {
    private final Method payMethod;

    PaymentInvoker(Class<?> serviceType) throws NoSuchMethodException {
        this.payMethod = serviceType.getMethod("pay", PaymentRequest.class);
    }

    String invoke(Object service, PaymentRequest request) {
        try {
            return (String) payMethod.invoke(service, request);
        } catch (InvocationTargetException ex) {
            throw new IllegalStateException("Payment target failed", ex.getCause());
        } catch (ReflectiveOperationException | IllegalArgumentException ex) {
            throw new IllegalStateException("Payment invocation contract is invalid", ex);
        }
    }
}
```

The string lookup and cast are concentrated in one adapter while the rest of the application can use a typed API. The `Method` is resolved once instead of being looked up on every request. Caching removes repeated metadata lookup, but it does not remove reflection's other trade-offs.

Only now is **Acting Dynamically from Metadata** complete: the learner has moved from `get/set`, `invoke`, and `newInstance` through dispatch, argument conversion, dynamic arrays, and the `MethodHandle` boundary. The next ROADMAP milestone is **Access, Encapsulation, and Module Boundaries**: finding a descriptor does not imply permission to use it. Generic signature metadata, Dynamic Proxy, and final synthesis follow afterward.
