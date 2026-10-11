An abstract class may own instance state and define constructors that establish shared base state:

```java
abstract class BasePayment {
    private final String provider;

    protected BasePayment(String provider) {
        this.provider = provider;
    }
}
```

An interface has no per-instance fields or constructors of its own. Every interface field is implicitly `public static final`, so it belongs to the interface type rather than becoming per-instance object state.

If several related subtypes truly share state, invariants, and initialization rules, an abstract class is often the more natural mechanism.
