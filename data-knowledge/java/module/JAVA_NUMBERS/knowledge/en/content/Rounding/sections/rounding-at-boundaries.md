Rounding may happen when:

- reducing scale with `setScale`;
- using a limited-precision `MathContext`;
- dividing a decimal with no terminating representation;
- converting a result to a fixed domain unit;
- applying legal/business rules.

```java
BigDecimal tax =
        new BigDecimal("10.235")
                .setScale(2, RoundingMode.HALF_UP);

System.out.println(tax); // 10.24
```

### Round at deliberate boundaries

```text
price × quantity
        ↓
subtotal
        ↓
discount
        ↓
tax
        ↓
final payable amount
```

Rounding after every operation can produce a different result from keeping intermediate precision and rounding only at the final business boundary.

A policy must answer:

```text
what is rounded?
when is it rounded?
to which scale?
with which mode?
```

### Double rounding

Rounding twice can differ from rounding directly to the final target:

```text
2.445

round to 2 decimals HALF_UP
→ 2.45

then to 1 decimal HALF_UP
→ 2.5

but directly to 1 decimal from 2.445
→ 2.4
```

Intermediate rounding therefore needs an explicit domain reason.
