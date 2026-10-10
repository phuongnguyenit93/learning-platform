# What Reflection Is and Why It Exists

Reflection matters when a program needs to treat **the structure of code as runtime data**. When code already knows exactly which type, field, method, or constructor it will use, ordinary Java syntax is clearer and the compiler can validate most mistakes ahead of time. Frameworks, serializers, test runners, and mapping tools often face a different problem: the concrete type or member is discovered only after the application is running.

The module uses one small model repeatedly:

~~~java
public record PaymentRequest(String orderId, long amount) {}

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
~~~

The goal of this chapter is to understand **what Reflection is, why it exists, and when runtime discovery is genuinely needed** before learning the individual APIs.
