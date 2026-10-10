`Comparable.compareTo` and `Comparator.compare` do not have to return exactly `-1`, `0`, or `1`. Their contract depends on the **sign** of the result:

```text
compare(a, b) < 0
→ a comes before b in the ordering

compare(a, b) == 0
→ a and b are equal under the ordering

compare(a, b) > 0
→ a comes after b in the ordering
```

For example:

```java
int result = Long.compare(orderA.id(), orderB.id());
```

If `result < 0`, `orderA` comes before `orderB` by id. Callers should not test `result == -1` or `result == 1`, because an implementation may return any negative or positive value as long as the sign is correct.

When an ordering is used by `TreeSet` or `TreeMap`, a result of `0` also affects element/key uniqueness. “Equal under the ordering” therefore has a real collection consequence, not only a sorting consequence.
