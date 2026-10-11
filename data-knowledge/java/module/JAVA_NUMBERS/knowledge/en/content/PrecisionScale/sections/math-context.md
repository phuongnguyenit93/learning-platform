`MathContext` controls **operation precision** together with a rounding mode:

```java
MathContext context =
        new MathContext(4, RoundingMode.HALF_EVEN);

BigDecimal result =
        new BigDecimal("123.45").multiply(
                new BigDecimal("9.876"),
                context
        );
```

### MathContext vs setScale

```text
setScale
→ controls result scale
→ often tied to decimal places/domain units

MathContext
→ controls total arithmetic precision
→ may round significant digits
```

Example:

```java
BigDecimal x = new BigDecimal("12345.67");

BigDecimal byScale =
        x.setScale(1, RoundingMode.HALF_UP);
// 12345.7

BigDecimal byPrecision =
        x.round(new MathContext(4, RoundingMode.HALF_UP));
// 1.235E+4
```

`MathContext.UNLIMITED` does not limit arithmetic precision, but operations such as non-terminating division can still require an explicit policy.

The next chapter treats rounding as a **numerical policy**, not just output formatting.
