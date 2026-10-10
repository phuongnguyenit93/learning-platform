# Runtime Type Model with Class<?>

The previous chapter established Class<?> as Reflection's main entry point. The next question a framework asks is: **what kind of runtime type is this, and what does its overall structure look like?**

Class-level metadata does not yet read object state or invoke behavior. It lets code classify a type, choose an appropriate form of its name, inspect modifiers, understand its inheritance relationships, and decide which member-discovery rules to use next.

The running model is:

~~~java
public interface PaymentProcessor {
    String pay(PaymentRequest request);
}

public class PaymentService implements PaymentProcessor {
    private final String provider;
    private int processedCount;

    public PaymentService(String provider) {
        this.provider = provider;
    }

    @Override
    public String pay(PaymentRequest request) {
        processedCount++;
        return provider + ":" + request.orderId();
    }

    private String internalStatus() {
        return provider + ":" + processedCount;
    }
}
~~~
