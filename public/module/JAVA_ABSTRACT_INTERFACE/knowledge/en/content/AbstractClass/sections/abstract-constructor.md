Even though an abstract class cannot be instantiated directly, its constructor still runs while a concrete subclass object is being created:

```java
class CardPayment extends BasePayment {
    CardPayment() {
        super("card");
    }

    @Override
    public void pay(int amount) { ... }
}
```

The `BasePayment` constructor is not inherited by `CardPayment`. It participates in the constructor chain and initializes the `BasePayment` portion of the `CardPayment` object before subclass construction completes.

Avoid calling overridable methods from constructors unless there is a strong reason. Subclass behavior may run before subclass-specific state has been initialized.
