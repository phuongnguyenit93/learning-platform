Two sets are equal when they have the same size and every element of one set is contained in the other. **Encounter order does not participate in `Set.equals`.**

```java
Set<Long> a = new HashSet<>(List.of(10L, 20L, 30L));
Set<Long> b = new LinkedHashSet<>(List.of(30L, 20L, 10L));

System.out.println(a.equals(b)); // true
```

That differs from `List.equals`, where each element's position is part of equality. If the domain value is “which members exist” rather than “which member is at each position,” `Set` usually expresses the semantics more accurately.
