# Field Discovery and State Metadata

Once **Runtime Type Model with Class<?>** has identified the runtime type, Reflection can discover the type's declared **state** through `Field` descriptors. This chapter focuses on finding fields and inspecting descriptor metadata; `get/set` operations belong to the later **Acting Dynamically from Metadata** milestone.

The running model keeps its baseline members and adds a few field shapes needed for this chapter:

~~~java
public class PaymentService {
    public static final String CHANNEL = "CARD";

    private final String provider;
    private int processedCount;
    private volatile boolean available = true;
    private List<String> supportedCurrencies = List.of("VND", "USD");

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

Field reflection has two separate stages: **discover a Field descriptor**, then **use that descriptor against a particular receiver**. This chapter focuses only on discovery; value access belongs to **Acting Dynamically from Metadata**, while access boundaries are handled afterward by **Access, Encapsulation, and Module Boundaries**.
