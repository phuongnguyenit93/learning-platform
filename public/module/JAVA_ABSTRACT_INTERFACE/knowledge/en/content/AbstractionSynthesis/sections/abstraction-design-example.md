```text
PaymentMethod
→ public contract used by checkout(...)

BasePayment
→ abstract base for one implementation branch sharing provider, validation, and base behavior

CardPayment
→ concrete class completing payment behavior

Refundable
→ independent capability that CardPayment or unrelated types may implement
```

A combined example:

```java
interface PaymentMethod {
    void pay(int amount);

    default String label() {
        return "payment";
    }
}

interface Refundable {
    void refund(int amount);
}

abstract class BasePayment implements PaymentMethod {
    private final String provider;

    protected BasePayment(String provider) {
        this.provider = provider;
    }

    protected String provider() {
        return provider;
    }
}

class CardPayment extends BasePayment implements Refundable {
    CardPayment() {
        super("card");
    }

    @Override
    public void pay(int amount) { ... }

    @Override
    public void refund(int amount) { ... }
}
```

No mechanism in the example replaces the others. Each mechanism owns a different responsibility.
