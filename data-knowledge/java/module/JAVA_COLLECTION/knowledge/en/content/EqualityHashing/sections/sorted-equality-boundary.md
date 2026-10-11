`TreeSet` and `TreeMap` have a different boundary: they organize data by `compareTo` or a `Comparator`. When comparison returns `0`, the sorted collection treats the two values/keys as occupying the same logical position for uniqueness.

`BigDecimal` is a classic example:

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("1.00");

System.out.println(a.equals(b));      // false
System.out.println(a.compareTo(b));   // 0

Set<BigDecimal> hashed = new HashSet<>(List.of(a, b));
Set<BigDecimal> sorted = new TreeSet<>(List.of(a, b));

System.out.println(hashed.size()); // 2
System.out.println(sorted.size()); // 1
```

This is not a random `TreeSet` bug. The set uses equivalence under its ordering relation to determine positions. However, when ordering is inconsistent with `equals`, the sorted set can violate the usual equality intuition of `Set` and surprise callers.

When designing a comparator for `TreeSet` or `TreeMap`, ask: “If this comparator returns `0`, do I really want the collection to treat these values as the same element/key?”. If not, the comparator needs an appropriate tie-breaker.
