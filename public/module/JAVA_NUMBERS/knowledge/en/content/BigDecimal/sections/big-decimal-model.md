A useful mental model is:

```text
 unscaled value (arbitrary-precision BigInteger)
      ×
10^(-scale)

scale
→ 32-bit int
```

For:

```text
123.45

unscaled value = 12345
scale          = 2
```

`1.0` and `1.00` have the same numerical quantity but different scales. Scale is part of the representation and later affects equality semantics.

So BigDecimal's "arbitrary precision" primarily refers to the **unscaled integer / number of digits**; the scale itself is not an unbounded integer.

### WHY BigDecimal matters

Money/rate/tax code often needs to answer more than "is the approximation close enough?"

It may need:

- an exact decimal quantity;
- a specific scale;
- a defined rounding boundary;
- a defined rounding mode;
- predictable comparison semantics.

BigDecimal exposes those policies explicitly instead of hiding them inside binary floating-point approximation.
