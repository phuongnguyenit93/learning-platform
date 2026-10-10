Use a custom functional interface when the domain meaning deserves a name that a general-purpose interface does not express well, or when the contract needs behavior such as a checked exception that standard interfaces do not declare.

```java
@FunctionalInterface
interface DiscountPolicy {
    BigDecimal discountFor(Order order);
}
```

Compared with `Function<Order, BigDecimal>`, `DiscountPolicy` makes the role of the behavior explicit at call sites:

```java
BigDecimal checkout(Order order, DiscountPolicy policy) {
    return order.total().subtract(policy.discountFor(order));
}
```

Prefer a standard interface when its name and shape already describe the behavior clearly. Prefer a domain-specific interface when the domain contract itself is important to readability, documentation, or future evolution.
