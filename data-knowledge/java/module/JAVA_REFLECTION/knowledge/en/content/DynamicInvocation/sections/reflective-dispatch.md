A reflective invocation can be modeled as a sequence:

```text
Class metadata
    ↓ resolve the intended Method
access check
    ↓
validate target + arguments
    ↓
apply permitted runtime conversions
    ↓
dispatch method
    ↓
return value or failure
```

Using the recurring model:

```java
PaymentService service = new PaymentService("stripe");
PaymentRequest request = new PaymentRequest("ORD-42", 150_000L);

Method pay = PaymentService.class.getMethod("pay", PaymentRequest.class);
Object result = pay.invoke(service, request);

System.out.println(result); // stripe:ORD-42
```

`getMethod("pay", PaymentRequest.class)` asks for a specific signature. Reflective lookup does not take arbitrary runtime values and reproduce Java compiler overload resolution for you. If a class has both `pay(String)` and `pay(PaymentRequest)`, dynamic code should resolve the intended signature explicitly.

For an instance method, `Method.invoke()` still uses dynamic method lookup on the runtime target. If the represented method is overridable and the target is an instance of a subclass that overrides it, dispatch can reach the overriding implementation. Reflection changes **how the descriptor and call boundary are selected**; it does not turn virtual dispatch into static dispatch.

Failures can occur at different stages:

- wrong lookup name/signature → `NoSuchMethodException`;
- inaccessible member → `IllegalAccessException`;
- incompatible target, wrong argument count, or invalid conversion → `IllegalArgumentException`;
- `null` target for an instance method → `NullPointerException`;
- the invoked method itself throws → `InvocationTargetException` wrapping the original failure.

Framework code therefore often distinguishes “the dynamic invocation could not be resolved” from “the business method ran and failed.”

```java
try {
    return pay.invoke(service, request);
} catch (InvocationTargetException ex) {
    Throwable targetFailure = ex.getCause();
    // map according to this adapter boundary's contract
    throw new IllegalStateException("Target method failed", targetFailure);
}
```
