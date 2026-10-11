Use `==` only when exact represented-value equality is really the contract.

Approximate computation often needs a tolerance:

```java
double actual = 0.1 + 0.2;
double expected = 0.3;
double epsilon = 1e-9;

boolean close = Math.abs(actual - expected) <= epsilon;
```

But one absolute epsilon is not universal. The correct strategy depends on scale, magnitude, and the domain error budget.

Useful APIs also include:

```java
Double.compare(a, b);
Double.isFinite(value);
Double.isNaN(value);
```

`Double.compare` does not have exactly the same semantics as `==`. It provides an ordering useful for sorting and defines behavior for NaN and signed zero, so choose the API that matches the question the domain is asking.

If the problem is unlimited integer range, move to `BigInteger`. If it is exact decimal behavior, move to `BigDecimal`.
