`HashMap` is a general-purpose implementation when fast key lookup matters and no specific encounter order is required.

A useful mental model is:

```text
key
 ↓ hashCode()
select candidate bucket/region
 ↓
equals() confirms equivalent key
 ↓
associated value
```

```java
Map<Long, Order> orderById = new HashMap<>();
for (Order order : orders) {
    orderById.put(order.id(), order);
}

Order found = orderById.get(1002L);
```

With reasonable hash distribution, `put`, `get`, and `remove` have expected near-O(1) cost. That is an expected hash-table characteristic, not an absolute worst-case guarantee for every key and state.

Like `HashSet`, correctness depends on keys keeping stable `equals/hashCode` behavior while stored in the map. If a field participating in hashing changes after `put`, later lookup may fail from the caller's perspective.

```java
record OrderKey(long id) {}

Map<OrderKey, Order> map = new HashMap<>();
map.put(new OrderKey(1001), order);
```

A record is convenient because its identity is value-based and immutable. Keys do not have to be records; the requirement is a suitable, stable equality/hash contract.

`HashMap` does not guarantee iteration order. Output that happens to match insertion order is still not a contract.
