`setScale` creates a value with the requested scale:

```java
BigDecimal value = new BigDecimal("12.345");
BigDecimal rounded =
        value.setScale(2, RoundingMode.HALF_UP);
```

Increasing scale can add trailing zeros without losing information:

```java
new BigDecimal("12.3").setScale(4);
// 12.3000
```

Reducing scale may discard digits and therefore require rounding.

### Moving the decimal point

```java
BigDecimal x = new BigDecimal("123.45");

x.movePointLeft(2);  // 1.2345
x.movePointRight(2); // 12345
```

These operations change the numerical value by powers of ten; they are not merely formatting operations.

### `stripTrailingZeros`

```java
BigDecimal x = new BigDecimal("1.2300");
BigDecimal normalized = x.stripTrailingZeros();
```

The numerical value is preserved, but representation and scale may change. That matters for equality, hash collections, and normalization policy.
