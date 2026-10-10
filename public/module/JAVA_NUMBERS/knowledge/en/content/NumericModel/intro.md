# How Java Represents Numbers

Java does not have one numeric representation that is ideal for every problem. Each representation trades off **range, exactness, performance, memory footprint, and rounding behavior**.

The core mental model is:

```text
int / long
→ fast, compact, exact integers inside a fixed range

float / double
→ wide range and efficient scientific/engineering arithmetic,
  but many decimal fractions are only approximations

BigInteger
→ integer arithmetic not limited by primitive fixed width

BigDecimal
→ explicit decimal value + scale,
  useful when decimal semantics and rounding policy matter
```

No representation gives unlimited range, exact decimal behavior, primitive speed, and a tiny footprint at the same time. Learning Java numbers therefore starts with **matching the representation to the problem contract**.

Roadmap:

```text
Why does Java need several numeric representations?
How Java Represents Numbers
        ↓
How can fixed-width integers fail?
Fixed-Width Integers and Overflow
        ↓
Why does 0.1 + 0.2 surprise people?
Floating-Point Approximation
        ↓
What if integer range is not enough?
Arbitrary-Precision Integers
        ↓
What if exact decimal semantics matter?
Exact Decimal Arithmetic
        ↓
How do precision, scale, and rounding become explicit policy?
Precision, Scale, and Rounding Policy
        ↓
Why can numerical equality and object equality answer different questions?
Numeric Equality and Ordering Contracts
        ↓
Which standard numeric helpers already exist?
Math Helpers and Safe Arithmetic
        ↓
How do pseudo-random and security randomness differ?
Random Generation and Security Requirements
        ↓
How do all of these choices come together in real code?
Choosing the Right Numeric Model
```

Three recurring value families are used throughout the module:

```text
counter / quantity / ID
→ integer semantics and overflow

sensor / scientific measurement
→ floating-point approximation and tolerance

money / rate / tax
→ BigDecimal, precision, scale and rounding policy
```
