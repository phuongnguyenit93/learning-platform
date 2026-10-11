`BigInteger` represents integers with arbitrary precision, limited mainly by available memory.

```java
BigInteger value =
        new BigInteger("123456789012345678901234567890");
```

Common construction options:

```java
BigInteger a = BigInteger.valueOf(123456789L);
BigInteger b = new BigInteger("FF", 16);
BigInteger zero = BigInteger.ZERO;
BigInteger one = BigInteger.ONE;
```

### WHY

`BigInteger` is useful when:

- combinatorial values grow beyond primitive limits;
- counters or domain values can exceed `long`;
- arbitrary-precision integer arithmetic is part of an algorithm;
- some cryptographic arithmetic needs very large integers.

The trade-off is clear:

```text
primitive integer
→ fixed size
→ very fast
→ little allocation

BigInteger
→ arbitrary precision
→ object based
→ arithmetic cost grows with value size
```

Do not use `BigInteger` merely because it sounds "safer" if `long` already satisfies the contract and primitive performance/interoperability matters.
