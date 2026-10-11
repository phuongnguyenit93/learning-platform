A practical heuristic:

| Need | Often a better fit |
| --- | --- |
| shared state and initialization rules | abstract class |
| reusable base implementation tied to one class family | abstract class |
| role/capability contract | interface |
| unrelated classes sharing one contract | interface |
| one class playing several roles | interface |
| flexible contract plus partial implementation | interface + abstract base class |

The mechanisms can work together:

```java
interface PaymentMethod {
    void pay(int amount);
}

abstract class BasePayment implements PaymentMethod {
    private final String provider;

    protected BasePayment(String provider) {
        this.provider = provider;
    }
}

class CardPayment extends BasePayment implements Refundable {
    ...
}
```

The interface defines the contract consumers depend on; the abstract class supplies reusable implementation for one branch. Another implementation can still implement `PaymentMethod` without extending `BasePayment`.

Once that basic choice is clear, the next step asks how **interfaces themselves can inherit and compose contracts**.
