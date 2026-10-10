A `default` method is an instance method with a body declared in the interface:

```java
interface PaymentMethod {
    void pay(int amount);

    default String label() {
        return "payment";
    }
}
```

Implementing classes may inherit `label()` without immediately writing another body.

Default methods remain virtual instance behavior and may be overridden. When several defaults compete, Java uses explicit conflict-resolution rules rather than choosing arbitrarily.

### WHY

If a public interface already has many implementations, adding a new abstract method forces those implementations to provide it. When a meaningful common default exists, a `default` method can extend the interface without forcing every existing implementation to add source code immediately.

`default` does not turn an interface into an abstract class: interfaces still have no independent instance fields or per-object constructors.
