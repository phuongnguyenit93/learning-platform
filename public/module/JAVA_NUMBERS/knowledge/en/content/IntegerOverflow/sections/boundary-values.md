Two's-complement signed integers have one more negative value than positive values:

```text
int
min = -2147483648
max =  2147483647
```

So:

```java
int abs = Math.abs(Integer.MIN_VALUE);
System.out.println(abs); // still Integer.MIN_VALUE
```

`Math.abs` cannot produce `2147483648` as an `int`. For this `int` overload, the result overflows back to `Integer.MIN_VALUE` rather than automatically throwing.

Similarly:

```java
int x = Integer.MIN_VALUE / -1;
System.out.println(x); // Integer.MIN_VALUE
```

Mathematically this requires `2147483648`, which does not fit in `int`. Java defines this special overflow case to return `Integer.MIN_VALUE`; integer division throws `ArithmeticException` for a zero divisor, not for this overflow.

Boundary-oriented tests should include:

```text
MIN_VALUE
MIN_VALUE + 1
-1
0
1
MAX_VALUE - 1
MAX_VALUE
```

If the domain can legitimately exceed `long`, the better representation is `BigInteger` rather than an ever-growing set of overflow checks.

The next chapter examines a different trade-off: floating point avoids this exact wraparound model but cannot represent every decimal fraction exactly.
