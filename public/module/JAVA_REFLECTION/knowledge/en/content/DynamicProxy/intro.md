# Dynamic Proxies and Call Interception

Earlier chapters used reflection to discover members and operate directly on their descriptors. Dynamic proxies raise that idea to a higher abstraction: instead of application code calling `Method.invoke()` everywhere, the JDK can generate an object at runtime that **implements one or more interfaces** and routes interface calls through an `InvocationHandler`.

This is a foundation for interception patterns such as logging, authorization, transaction boundaries, metrics, and remote clients. The caller still sees a normal typed interface; the dynamic behavior lives behind the proxy.

To connect with the recurring example, we add an interface because JDK dynamic proxies are interface-based:

```java
interface PaymentGateway {
    String pay(PaymentRequest request);
}

final class PaymentGatewayImpl implements PaymentGateway {
    private final PaymentService service;

    PaymentGatewayImpl(PaymentService service) {
        this.service = service;
    }

    @Override
    public String pay(PaymentRequest request) {
        return service.pay(request);
    }
}
```
