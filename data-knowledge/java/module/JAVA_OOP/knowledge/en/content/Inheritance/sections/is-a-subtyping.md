### WHAT — what should “is-a” really mean?

In Java, class inheritance with `extends` creates a subtype relationship: an object of the subclass can be assigned to a superclass reference when the type system permits it.

```java
PaymentMethod payment = new CardPayment();
```

But “is-a” should not merely mean “these classes share some fields”. It should mean something stronger: **the subtype can honor the contract that callers expect from the supertype**.

If `CardPayment` only reuses code from `PaymentMethod` but breaks important expectations of the contract, the code may compile while the design is still wrong.

### RELATION — inheritance and subtyping serve different motivations

Java class inheritance can carry two ideas at once:

```text
implementation reuse
→ inherit behavior/state from a base class

subtyping
→ use a subclass object where a supertype is required
```

These motivations are often conflated. If the only goal is to reuse a few methods, composition may create less coupling. If callers truly need a subtype contract, inheritance/subtyping has a clearer design reason.

Interfaces also create subtyping without class implementation inheritance; the `abstract-interface` module goes deeper into interface and abstract-class mechanics.

### BOUNDARY — Java allows only one direct superclass

A Java class can `extend` only **one direct class**. This avoids some state/implementation conflicts of multiple class inheritance, but it also makes the superclass choice a strong coupling decision.

A `final class` cannot be subclassed. In design terms, `final` can express that the type is not intended to have its class contract extended through inheritance.

### PRACTICE — test “is-a” through behavior

Do not ask only “does the name `CardPayment` sound like a payment?”. Ask: **can every caller that knows only `PaymentMethod` use `CardPayment` without special-casing it?**
