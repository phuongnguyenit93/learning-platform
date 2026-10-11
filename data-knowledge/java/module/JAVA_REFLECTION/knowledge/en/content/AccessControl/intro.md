# Access, Encapsulation, and Module Boundaries

The earlier chapters showed that reflection can discover `Field`, `Method`, and `Constructor` objects from runtime metadata instead of using direct source-level calls. That raises an important question: if `getDeclaredMethod()` can see a `private` method, does `private` still matter?

The key idea is that **discovering metadata is not the same as being allowed to use the underlying member**. Reflection can describe runtime structure, while reading a field, invoking a method, or constructing an object still goes through access control. `AccessibleObject` offers a controlled way to request suppression of some language access checks, and the Java Module System can still deny that request.

We keep the **same public-class/public-constructor baseline** used by the previous chapters; this chapter changes only the member being accessed so a beginner does not confuse reflective-access failure with a silently changed sample type:

```java
record PaymentRequest(String orderId, long amount) {}

public class PaymentService {
    private final String provider;
    private int processedCount;

    public PaymentService(String provider) {
        this.provider = provider;
    }

    public String pay(PaymentRequest request) {
        processedCount++;
        return provider + ":" + request.orderId();
    }

    private String internalStatus() {
        return provider + ":" + processedCount;
    }
}
```
