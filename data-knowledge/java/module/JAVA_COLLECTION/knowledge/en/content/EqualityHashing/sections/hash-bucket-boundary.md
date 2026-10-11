A useful mental model for hash-based collections is:

```text
hashCode()
   ↓
narrow candidate bucket/area
   ↓
equals()
   ↓
confirm the matching key/element
```

A hash does not prove equality. Different objects may collide and enter the same candidate area; `equals` must still distinguish them. Conversely, if two objects are equal but produce different hash codes, a hash-based collection may search different areas and the lookup/uniqueness contract breaks.

```java
Map<Long, Order> byId = new HashMap<>();
byId.put(101L, new Order(101L, 1L, 20_000));

Order order = byId.get(101L);
```

Exact buckets, tree bins, and resize thresholds are JDK implementation details and should not become business assumptions. The contract-level model is enough: hashing narrows the search, equality confirms the match, and key state that participates in those calculations must remain stable while the key is stored.
