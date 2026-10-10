`Map<K, V>` is not a `Collection<V>`. A collection models a group of **elements**; a map models a group of **key-to-value mappings**. Their meaningful units are different.

For example:

```java
List<Order> orders = List.of(
        new Order(1001, 7, 120),
        new Order(1002, 7, 80)
);

Map<Long, Order> orderById = Map.of(
        1001L, orders.get(0),
        1002L, orders.get(1)
);
```

With a `List<Order>`, natural questions are “what is at position 0?” or “visit every order.” With a `Map<Long, Order>`, the natural question is “which order belongs to key 1002?” If `Map` extended `Collection`, an operation such as `add(E)` could not express that a mapping requires both a key and a value.

Map still exposes **collection views** that bridge the two models:

```java
Set<Long> ids = orderById.keySet();
Collection<Order> values = orderById.values();
Set<Map.Entry<Long, Order>> entries = orderById.entrySet();
```

Those views are useful for traversing keys, values, or entries, while `Map` keeps its own key uniqueness and lookup contract.

Since Java 21, `SequencedMap` adds first/last entry operations and reversed views for maps with a defined encounter order. It remains on the `Map` branch; it does not turn `Map` into a `Collection`.
