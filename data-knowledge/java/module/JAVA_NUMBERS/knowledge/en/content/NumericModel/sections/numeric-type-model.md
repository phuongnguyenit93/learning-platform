### WHAT — which numeric representations does Java provide?

Fixed-width integer primitives:

| Type | Bits | Minimum | Maximum |
| --- | ---: | ---: | ---: |
| `byte` | 8 | -128 | 127 |
| `short` | 16 | -32,768 | 32,767 |
| `int` | 32 | -2³¹ | 2³¹ - 1 |
| `long` | 64 | -2⁶³ | 2⁶³ - 1 |

`char` is also an integral primitive type, but it primarily models a UTF-16 code unit. For arithmetic in this module, the main focus is `byte/short/int/long`.

Floating-point primitives:

```text
float   → IEEE 754 binary32
double  → IEEE 754 binary64
```

Important object types:

```text
BigInteger
→ arbitrary-precision integer

BigDecimal
→ arbitrary-precision unscaled integer + int scale
→ explicit decimal semantics and rounding policy
```

### WHY — why are several representations necessary?

Start with the domain requirement:

| Problem | Common representation | Primary reason |
| --- | --- | --- |
| small quantities, indexes, counters | `int` | simple and efficient |
| large counters/timestamps | `long` | wider range |
| scientific/sensor/graphics values | `double` | wide range + hardware support |
| integers beyond `long` | `BigInteger` | no fixed-width limit |
| money, tax, decimal rates | `BigDecimal` | explicit decimal semantics and rounding |

A database identifier may use `long` because range matters, not because arithmetic is central. A temperature measurement can use `double` because tolerance is acceptable. Money often needs `BigDecimal` because decimal behavior is part of the contract.

### HOW — choose from the problem contract

Ask:

```text
1. Is a fractional value required?
        ↓
2. Is exact decimal behavior required?
        ↓
3. What range is required?
        ↓
4. Is overflow/rounding acceptable?
        ↓
5. Do performance and footprint matter?
```

Do not choose `double` merely because it can represent large magnitudes, and do not use `BigDecimal` everywhere merely because it sounds "more precise". Each representation solves a different contract.
