`compareTo` answers the numerical-ordering question:

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("1.00");

System.out.println(a.compareTo(b)); // 0
```

Mental model:

```text
equals
→ representation + scale

compareTo
→ numerical ordering
```

This is a well-known exception to the general recommendation that `compareTo == 0` should be consistent with `equals`.

### Comparing with zero

If the intent is numerical zero, this is often clearer:

```java
value.compareTo(BigDecimal.ZERO) == 0
```

because `0.00` is not `equals(BigDecimal.ZERO)` but is numerically zero.
