For:

```text
123.45
```

we have:

```text
precision = 5
→ total number of digits in the unscaled value

scale = 2
→ decimal scaling exponent used to place the point
```

In code:

```java
BigDecimal value = new BigDecimal("123.45");

System.out.println(value.precision()); // 5
System.out.println(value.scale());     // 2
```

### Scale is not always just "digits after the decimal point"

Scale may be zero, positive, or negative:

```java
BigDecimal value =
        new BigDecimal("1000")
                .stripTrailingZeros();

System.out.println(value);        // may be 1E+3
System.out.println(value.scale()); // may be -3
```

The more general model is:

```text
value = unscaledValue × 10^(-scale)
```
