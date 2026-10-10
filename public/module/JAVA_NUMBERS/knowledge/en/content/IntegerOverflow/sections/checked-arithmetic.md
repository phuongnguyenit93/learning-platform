When overflow is a **contract failure**, checked arithmetic makes the failure explicit instead of accepting wraparound.

```java
try {
    int next = Math.addExact(Integer.MAX_VALUE, 1);
} catch (ArithmeticException ex) {
    System.out.println("overflow detected");
}
```

The `Math` chapter later owns the complete exact-arithmetic helper catalog and API mechanics. The important idea here is the decision boundary:

```text
ordinary fixed-width arithmetic
→ overflow may wrap

checked arithmetic
→ overflow becomes ArithmeticException
```

This does not mean every arithmetic operation must be checked. Some low-level algorithms intentionally rely on wraparound. The domain contract decides.

With the repository's Java 21 baseline, `absExact` and `divideExact` are especially useful for the boundary cases below: `MIN_VALUE` has no positive counterpart in the same primitive type, and `MIN_VALUE / -1` overflows.
