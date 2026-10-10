### WHAT

“Program to abstraction” means consumers depend on a stable role or contract rather than an unnecessary concrete implementation.

```java
final class Checkout {
    private final Pricing pricing;

    Checkout(Pricing pricing) {
        this.pricing = pricing;
    }
}
```

`Checkout` knows `Pricing`; it does not need to know specifically about `Discount` or `Regular`.

### WHY — reduce what consumers need to know

When an implementation changes, the consumer may remain unchanged as long as the contract still holds. That is what allows polymorphism and composition to create real flexibility.

### TRADE-OFF — do not create an interface for every class

An abstraction layer should represent a meaningful role/contract, variation point, test boundary, or architectural boundary. Creating `FooInterface` for `FooImpl` merely because “OOP best practice says so” can add indirection without reducing real coupling.

### PRACTICE — inspect dependency direction

Ask the consumer: **which capability does it need, and is it depending on a concrete type only for convenience?** If it needs only a stable subset of behavior, that may be a candidate for a better abstraction.
