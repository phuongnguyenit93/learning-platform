### HOW — what does a subclass object contain?

A subclass object has the state/behavior defined by its superclass plus its own additions. Accessible instance methods may be inherited; private superclass state still exists but cannot be accessed directly through normal member access from the subclass.

### DISTINCTION — declared, inherited, and accessible are different questions

Keep these questions separate:

```text
Where is the member declared?
        ↓
Is that member inherited by the subtype?
        ↓
Does the current code have access to it?
```

Private superclass state is still part of a `Child` object, but `Child` source code cannot directly access that field. A superclass method may be inherited and usable when access rules allow it.

The complete `private` / package-private / `protected` / `public` rules belong to `class-object → Access Modifier`; this chapter keeps only the mental model needed for inheritance.

```java
class PaymentMethod {
    String provider() { return "generic"; }
}

class CardPayment extends PaymentMethod {
    String cardNetwork() { return "VISA"; }
}
```

A `CardPayment` may use `provider()` when it is accessible while also providing behavior of its own.

### BOUNDARY WITH CLASS-OBJECT — constructors are not inherited

Constructors are **not inherited**. Constructing a subclass object still requires the superclass-owned portion of state to be initialized through the appropriate `this(...)` / `super(...)` chain.

A subclass constructor may first delegate to another constructor in the same class with `this(...)`; that chain must eventually reach a superclass constructor through an explicit `super(...)` call or an implicitly inserted `super()` when valid. Superclass construction completes before subclass instance initializers run and before the subclass constructor body executes.

The full `this(...)`, `super(...)`, constructor-chaining, and initialization-order mechanics belong to `class-object → this, super, and constructor chaining`. OOP only needs the design consequence: **a subclass can become coupled to how its superclass establishes and manages superclass-owned state**.

### RELATION — inherited behavior is not yet the interesting part of polymorphism

Simply “having a method from a parent” is not the key mechanism. When a subclass **overrides** an instance method and a caller holds a supertype reference, runtime method selection becomes important. That is the bridge to polymorphism and dynamic dispatch.
