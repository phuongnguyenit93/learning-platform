### CONCEPT

An `interface` names a **behavioral role or contract** that different kinds of classes may implement. In Java 21, ordinary classes, enum classes, record classes, and generated proxy classes can implement interfaces when appropriate.

```java
interface PaymentMethod {
    void pay(int amount);
}
```

A class implementing `PaymentMethod` promises that consumers can request `pay(...)` through the `PaymentMethod` type without knowing the concrete class behind it.

### WHY

Interfaces reduce unnecessary dependence on concrete implementations:

```java
void checkout(PaymentMethod payment) {
    payment.pay(100);
}
```

`checkout(...)` depends on the `PaymentMethod` contract rather than directly on `CardPayment`, `WalletPayment`, or another specific implementation.
