Useful groups include:

```text
basic selection
→ abs, min, max

power/root
→ pow, sqrt, cbrt

rounding helpers
→ floor, ceil, round, rint

trigonometry/logarithm
→ sin, cos, tan, log, exp

integer helpers
→ floorDiv, floorMod, exact arithmetic

floating-point helpers
→ ulp, nextUp, nextDown, copySign...
```

### `floor`, `ceil`, and `round`

```java
Math.floor(2.7);  // 2.0
Math.ceil(2.1);   // 3.0
Math.round(2.5);  // 3

Math.floor(-2.1); // -3.0
Math.ceil(-2.9);  // -2.0
```

`floor` means toward negative infinity, not simply "remove the decimal part".

### `floorDiv` and `floorMod`

Ordinary integer division truncates toward zero:

```java
System.out.println(-7 / 3); // -2
```

`Math.floorDiv` uses floor-division semantics:

```java
System.out.println(Math.floorDiv(-7, 3)); // -3
```

That distinction matters for algorithms that require mathematical floor behavior with negative numbers.
