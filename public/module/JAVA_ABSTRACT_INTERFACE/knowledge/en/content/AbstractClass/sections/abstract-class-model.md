### CONCEPT

An `abstract class` cannot be instantiated directly, but it may still contain:

- instance state through fields;
- constructors;
- concrete methods with bodies;
- abstract methods without bodies.

An abstract class does **not** have to declare an abstract method. Marking the class `abstract` first means that the class itself is not a directly instantiable concrete type.

That makes an abstract class useful as a **partial implementation** for a closely related family of subclasses.

```java
abstract class BasePayment {
    private final String provider;

    protected BasePayment(String provider) {
        this.provider = provider;
    }

    String provider() {
        return provider;
    }

    public abstract void pay(int amount);
}
```

`BasePayment` owns shared state and behavior while requiring concrete subclasses to complete `pay(...)`.

### WHY

If several related classes genuinely share state, initialization rules, invariants, and common behavior, duplicating those rules across subclasses creates repetition and makes shared constraints harder to maintain. An abstract class centralizes the common part while leaving explicit extension points.

The next chapter places a `PaymentMethod` interface above this implementation so the **contract consumers depend on** stays separate from the **shared implementation** reused by one class branch.
