Two maps are equal when they represent the same set of `key → value` mappings. Encounter order and concrete implementation do not determine `Map.equals`.

```java
Map<Long, String> a = new HashMap<>();
a.put(1L, "A");
a.put(2L, "B");

Map<Long, String> b = new LinkedHashMap<>();
b.put(2L, "B");
b.put(1L, "A");

System.out.println(a.equals(b)); // true
```

Key and value comparisons still depend on the equality contracts of those objects. Designing `equals/hashCode` belongs to the Object Contract module; the collection-specific point is that changing map ordering does not by itself make two maps unequal when their mappings are unchanged.
