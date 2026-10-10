Many map operations have the shape “read the old value, calculate a new value, write it back.” `Map` has methods that express this pattern directly.

Count orders per user:

```java
Map<Long, Integer> orderCountByUser = new HashMap<>();

for (Order order : orders) {
    orderCountByUser.merge(order.userId(), 1, Integer::sum);
}
```

`merge(key, value, remappingFunction)` requires the supplied `value` to be non-null:

- uses the supplied value when there is no mapping or the current mapping is null;
- invokes the remapping function with old/new values when a non-null value exists;
- removes the mapping if the remapping function returns null.

Create a collection per key:

```java
Map<Long, List<Order>> ordersByUser = new HashMap<>();

for (Order order : orders) {
    ordersByUser
            .computeIfAbsent(order.userId(), id -> new ArrayList<>())
            .add(order);
}
```

`computeIfAbsent` creates a value only when no non-null mapping exists; if its mapping function returns null, no mapping is recorded.

When recalculation needs both the key and current value:

```java
totals.compute(userId, (id, current) ->
        current == null ? order.totalCents() : current + order.totalCents()
);
```

If the `compute` remapping function returns null, the mapping is removed.

These APIs keep update logic close to its intent and often read better than `get → if → put`. They do not imply that every `Map` makes a compound update atomic across threads; atomicity depends on contracts such as `ConcurrentMap`/`ConcurrentHashMap` and belongs to the concurrency curriculum.
