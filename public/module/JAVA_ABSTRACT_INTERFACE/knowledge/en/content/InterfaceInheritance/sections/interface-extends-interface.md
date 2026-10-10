An interface uses `extends` to inherit one or more interfaces:

```java
interface Payable {
    void pay();
}

interface RefundablePayment extends Payable {
    void refund();
}
```

A class implementing `RefundablePayment` must satisfy both `pay()` and `refund()`.

A subinterface may also add methods or refine a compatible return type.
