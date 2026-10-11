BigDecimal is immutable:

```java
BigDecimal amount = new BigDecimal("10.00");
BigDecimal fee = new BigDecimal("1.25");

amount.add(fee); // amount unchanged
amount = amount.add(fee);
```

Core arithmetic:

```java
amount.add(fee);
amount.subtract(discount);
amount.multiply(rate);
amount.divide(divisor);
```

### Arithmetic also carries scale semantics

Operations affect more than the numerical quantity. Without a `MathContext`, preferred result scale follows operation-specific rules:

```text
add/subtract
→ preferred scale is generally max(left scale, right scale)

multiply
→ preferred scale = left scale + right scale

exact divide
→ preferred scale starts from left scale - right scale,
  although an exact quotient may require a larger scale
```

Do not infer the result scale only from how the input text looks. If the domain requires a fixed output scale, apply that policy explicitly at the appropriate boundary.

### Division may require a rounding policy

```java
BigDecimal.ONE.divide(new BigDecimal("3"));
```

`1 / 3` has no finite decimal representation, so exact division cannot complete and may throw `ArithmeticException`.

Supply the policy explicitly:

```java
BigDecimal result =
        BigDecimal.ONE.divide(
                new BigDecimal("3"),
                4,
                RoundingMode.HALF_UP
        );
```

BigDecimal does not know whether a currency uses scale 2 or 0, whether tax rounds per line or at the final total, or which legal rounding rule applies.

That is intentional:

```text
BigDecimal
→ decimal arithmetic mechanism

domain policy
→ precision / scale / rounding boundary
```

The next chapter separates **precision** from **scale**.
