Prefer a standard functional interface when its contract communicates the intent well:

```java
Predicate<Order> eligible;
Function<Order, BigDecimal> totalCalculator;
Supplier<Clock> clockSupplier;
```

Create a domain-specific interface when the domain meaning is important enough to deserve its own contract:

```java
@FunctionalInterface
interface FraudRule {
    boolean isSuspicious(Payment payment);
}
```

The choice is a readability and API-design decision, not a contest to minimize the number of custom types.

Use a standard interface when:

- its input/output shape already explains the behavior;
- callers benefit from familiar Java vocabulary;
- standard composition methods are useful.

Use a custom interface when:

- the domain role needs an explicit name;
- the contract needs a checked exception or another domain-specific promise;
- using `Function`/`Predicate` would hide important meaning from the API.

Whichever form you choose, keep the functional contract focused on one coherent behavior.
