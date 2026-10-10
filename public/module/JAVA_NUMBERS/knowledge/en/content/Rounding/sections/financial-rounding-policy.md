A money/tax/rate policy often needs to define:

- currency scale;
- line-item vs final-total rounding;
- rounding mode;
- intermediate precision;
- what happens when exact representation at the target scale is impossible.

Two valid-looking implementations can disagree:

```text
Policy A
→ round every line item
→ sum rounded values

Policy B
→ sum exact/intermediate values
→ round the final total
```

### `UNNECESSARY` as an assertion

```java
BigDecimal exact =
        new BigDecimal("10.00")
                .setScale(2, RoundingMode.UNNECESSARY);
```

`UNNECESSARY` is useful when the contract says rounding must not happen. Java throws `ArithmeticException` if digits would need to be discarded.

The next chapter covers another BigDecimal subtlety: equal numerical quantity does not always mean `equals` returns true.
