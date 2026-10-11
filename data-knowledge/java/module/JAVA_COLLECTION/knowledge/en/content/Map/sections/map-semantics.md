`Map<K, V>` stores `key → value` mappings. Each key appears at most once, while multiple keys may map to equal values.

```java
Map<Long, Order> orderById = new HashMap<>();

orderById.put(1001L, new Order(1001, 7, 120));
orderById.put(1002L, new Order(1002, 8, 90));

Order order = orderById.get(1002L);
```

Putting an existing key replaces its previous mapping and returns the old value:

```java
Order previous = orderById.put(
        1002L,
        new Order(1002, 8, 110)
);
```

That differs from `Set`: a set asks “is this element already present?”, while a map asks “which value is associated with this key?”
