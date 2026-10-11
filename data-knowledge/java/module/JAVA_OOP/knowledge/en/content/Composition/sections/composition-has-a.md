### WHAT

Composition builds behavior by storing references to collaborators and delegating some work to them.

```java
final class Checkout {
    private final Pricing pricing;

    Checkout(Pricing pricing) {
        this.pricing = pricing;
    }

    int total(int base) {
        return pricing.price(base);
    }
}
```

`Checkout` **has-a** `Pricing`. It should not `extend Pricing` because checkout is not a pricing policy.

### TERMINOLOGY — “composition” is used in two common senses

In OOP discussions, **object composition** is often used broadly: build an object by combining collaborators instead of inheriting implementation.

In UML/object modeling, **composition** also has a narrower meaning: a whole–part relationship with strong ownership and a part lifecycle tied closely to the whole.

This chapter uses both contexts, so pay attention to the question being answered:

```text
composition as a design technique
→ combine objects / delegate behavior instead of extending a class

composition as a UML relationship
→ strong ownership + lifecycle semantics
```

The two meanings are related but **not identical**. Merely storing a collaborator for delegation is not enough to prove UML composition.

### WHY — reuse behavior without inheriting implementation

If the goal is to vary pricing strategy, composition lets us inject `Regular`, `Discount`, or another implementation without changing the type hierarchy of `Checkout`.

Variation stays in the collaborator rather than turning the consumer into a complex base/subclass hierarchy.

### EVIDENCE — `CompositionController#strategySwap()`

The experiment creates:

```text
new Checkout(new Regular())
new Checkout(new Discount())
```

`Checkout` does not change; only the `Pricing` collaborator changes. The response shows different behavior while the consumer type remains the same.
