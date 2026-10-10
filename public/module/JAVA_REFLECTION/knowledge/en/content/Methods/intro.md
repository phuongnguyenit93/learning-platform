# Method Discovery and Signature Metadata

After `Field`, the **Discovering Class Members** milestone moves to **behavior**: locate a `Method` from metadata and inspect its signature without requiring a specific method call to be hard-coded in source. Actual `Method.invoke(...)` execution belongs to the later **Acting Dynamically from Metadata** milestone.

The running model is:

~~~java
public class PaymentService {
    private final String provider;
    private int processedCount;

    public PaymentService(String provider) {
        this.provider = provider;
    }

    public String pay(PaymentRequest request) throws PaymentException {
        processedCount++;
        return provider + ":" + request.orderId();
    }

    private String internalStatus() {
        return provider + ":" + processedCount;
    }
}
~~~

A framework usually should not begin with Method.invoke(...). It first has to answer three questions: **which method**, **which signature**, and **which receiver/arguments satisfy that signature**. Invocation is the final step.
