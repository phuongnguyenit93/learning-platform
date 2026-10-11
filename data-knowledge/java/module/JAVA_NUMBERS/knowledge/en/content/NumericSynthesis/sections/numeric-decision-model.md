Start from the meaning of the value, not from a Java type name.

```text
Is the value always a whole number?
        │
        ├─ yes → can the valid range fit in int/long?
        │           ├─ yes → fixed-width integer
        │           └─ no  → BigInteger
        │
        └─ no → is exact decimal behavior part of the contract?
                    ├─ yes → BigDecimal
                    └─ no  → float/double, usually double
```

That first choice is only the beginning. Ask the second set of questions immediately:

```text
fixed-width integer
→ what happens if the range is exceeded?
→ is wraparound acceptable or must overflow be detected?

floating point
→ what approximation is acceptable?
→ how is comparison tolerance defined?

BigInteger
→ is the extra allocation/computation cost acceptable?
→ what happens when converting back to primitives?

BigDecimal
→ what do scale and precision mean for this domain?
→ where is rounding allowed?
→ is identity based on representation or numerical quantity?
```

The important habit is to pair every representation with its **known failure mode**.
