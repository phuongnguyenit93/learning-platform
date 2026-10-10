# Constructor Discovery and Construction Metadata

Field and Method describe state and behavior. `Constructor` completes the **Discovering Class Members** milestone by asking: **which constructors does this runtime type declare, and what metadata lets a framework choose the right descriptor?** Actual `Constructor.newInstance(...)` execution belongs to the next **Acting Dynamically from Metadata** milestone.

This is common in dependency-injection containers, plugin systems, serializers/deserializers, and framework bootstrapping. The framework receives a `Class<?>`, discovers constructors, and applies a selection policy before it performs object creation.

The baseline model remains:

~~~java
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

This chapter adds one overload only to demonstrate constructor selection:

~~~java
public PaymentService(String provider, int initialProcessedCount) {
    this.provider = provider;
    this.processedCount = initialProcessedCount;
}
~~~
