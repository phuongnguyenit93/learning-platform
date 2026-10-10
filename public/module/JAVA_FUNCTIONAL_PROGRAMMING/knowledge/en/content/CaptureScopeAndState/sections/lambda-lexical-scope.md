A lambda is **lexically scoped**: names used inside it are resolved from the surrounding source context in much the same way as names in the enclosing method or block.

```java
class PriceService {
    private final BigDecimal taxRate = new BigDecimal("0.10");

    Function<BigDecimal, BigDecimal> taxedPrice() {
        BigDecimal serviceFee = new BigDecimal("2.00");

        return price -> price
                .add(serviceFee)
                .multiply(BigDecimal.ONE.add(taxRate));
    }
}
```

The lambda body can refer to the local `serviceFee` and the instance field `taxRate` because both names are visible at the lambda's source location.

A lambda does not introduce a separate object-style scope for `this` or `super`. This differs from an anonymous class and becomes important when reading code that accesses enclosing members.
