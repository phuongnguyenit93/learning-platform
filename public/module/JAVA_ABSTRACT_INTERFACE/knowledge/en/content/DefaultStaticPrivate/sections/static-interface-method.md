A static interface method belongs to the interface type itself. It is useful when an operation belongs closely to the contract but does not need state from a particular object:

```java
interface PaymentMethod {
    void pay(int amount);

    static void validate(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("amount must be positive");
        }
    }
}

PaymentMethod.validate(100);
```

It is **not inherited** by implementing classes or subinterfaces. Call it through the interface that declares it, such as `PaymentMethod.validate(...)`; do not treat it as an instance method or as a member inherited under a subinterface name.

Static interface methods can work well for factories, validators, or helpers closely tied to the contract and independent of instance state. The relationship should still be meaningful; an interface should not become a miscellaneous utility container.
