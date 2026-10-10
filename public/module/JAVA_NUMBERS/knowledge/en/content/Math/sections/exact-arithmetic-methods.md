Helpers include:

```java
Math.addExact
Math.subtractExact
Math.multiplyExact
Math.incrementExact
Math.decrementExact
Math.negateExact
Math.absExact
Math.divideExact
Math.floorDivExact
Math.ceilDivExact
Math.toIntExact
```

They turn silent overflow into `ArithmeticException`.

```java
long total =
        Math.multiplyExact(
                (long) quantity,
                unitPrice
        );
```

Exact helpers do not create arbitrary precision. If a valid domain value can exceed `long`, `BigInteger` is still the appropriate representation.

On Java 21, `Math.absExact(Integer.MIN_VALUE)` and `Math.divideExact(Integer.MIN_VALUE, -1)` throw `ArithmeticException` instead of returning the silent overflow result produced by their unchecked counterparts.
