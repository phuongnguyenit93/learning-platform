Delegation means an object receives a request and forwards part of the work to a collaborator that owns the relevant responsibility.

```java
int total(int base) {
    return pricing.price(base);
}
```

`Checkout` does not need to know the discount formula. It only knows the `Pricing` contract.

### RELATION — delegation leads to abstraction

For composition to stay flexible, the consumer should depend on a **stable contract** rather than implementation details. That is why composition and abstraction often reinforce each other.

### DISTINCTION — composition and delegation are not the same thing

```text
Composition
→ A keeps/has collaborator B as part of its object structure

Delegation
→ A receives a request and hands a specific responsibility to B
```

In the module's running example, `Checkout` may keep a `Pricing` collaborator without making every `Checkout` responsibility belong to `Pricing`. When `Checkout.total(...)` calls `pricing.price(...)`, **the pricing responsibility itself** is delegated to the `Pricing` collaborator.

```text
Checkout
→ owns checkout coordination

Pricing
→ owns pricing behavior

Checkout.total(...)
→ delegates pricing work to Pricing.price(...)
```

### TRADE-OFF

Too many pass-through layers that add no responsibility can become ceremony. Delegation is valuable when the collaborator truly owns distinct behavior or a variation point.
