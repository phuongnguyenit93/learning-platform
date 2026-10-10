A class may implement multiple interfaces. The running example can combine a consumer-facing contract, shared implementation, and an independent capability:

```java
interface Refundable {
    void refund(int amount);
}

class CardPayment extends BasePayment
        implements PaymentMethod, Refundable {

    @Override
    public void pay(int amount) { ... }

    @Override
    public void refund(int amount) { ... }
}
```

This lets one object play several roles without multiple class inheritance.

Compatible abstract requirements from several interfaces can be satisfied by one implementation. Competing `default` methods use separate conflict-resolution rules, which are learned after interface inheritance and interface method kinds are established.

### RELATION

We now have two tools that may both participate in a contract-oriented design: abstract classes and interfaces. The next step compares them directly and asks **when should each be chosen?**
