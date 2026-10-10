IEEE 754 includes special values:

```text
NaN
→ a non-ordinary numeric result

Infinity / -Infinity
→ some overflow/division-by-zero results

+0.0 / -0.0
→ zero values with different signs in the representation
```

```java
double nan = 0.0 / 0.0;
double inf = 1.0 / 0.0;

System.out.println(Double.isNaN(nan));      // true
System.out.println(Double.isInfinite(inf)); // true
```

NaN propagates through many operations:

```java
double result = Double.NaN + 10;
System.out.println(result); // NaN
```

Use `Double.isNaN(value)` instead of comparing NaN with `==`.

Signed zero compares equal:

```java
System.out.println(0.0 == -0.0); // true
```

but can still affect arithmetic:

```java
System.out.println(1.0 / 0.0);  // Infinity
System.out.println(1.0 / -0.0); // -Infinity
```
