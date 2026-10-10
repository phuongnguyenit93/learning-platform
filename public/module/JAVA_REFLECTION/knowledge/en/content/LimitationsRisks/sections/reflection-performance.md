Reflection has overhead, but “reflection is always slow” is too crude to be a useful design rule.

Cost can appear in several places:

- repeated lookup such as `getDeclaredMethod()` or scanning all members;
- annotation/generic metadata parsing and resolution;
- access checks;
- argument packing, unboxing/widening, and return boxing;
- reflective dispatch that may be less optimizable than a direct call site in some hot paths.

Modern Java runtimes have substantially evolved Core Reflection, so design decisions should not rely on old benchmark folklore or historical implementation details. A practical first step is to **avoid repeating metadata discovery unnecessarily**.

```java
final class PaymentInvoker {
    private final Method pay;

    PaymentInvoker() throws NoSuchMethodException {
        this.pay = PaymentService.class.getMethod("pay", PaymentRequest.class);
    }

    Method method() {
        return pay;
    }
}
```

Frameworks often resolve metadata at startup, registration time, or first use, then cache a validated descriptor or invocation plan. Caching removes repeated lookup/parsing; it does not remove argument conversion, dynamic dispatch, or maintainability costs.

If reflection is inside a hot loop and performance actually matters, measure the real workload with profiling/benchmarking. When a callable target is resolved once and invoked many times, a `MethodHandle` or generated code may be worth considering, but the choice should follow the use case rather than the slogan that reflection is slow.
