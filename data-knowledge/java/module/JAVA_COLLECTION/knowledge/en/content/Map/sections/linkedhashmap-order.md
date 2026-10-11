`LinkedHashMap` keeps hash-map mappings while also maintaining a defined encounter order. Two modes matter.

### Insertion order

The usual constructor keeps keys in the order of their first insertion:

```java
Map<Long, Order> orders = new LinkedHashMap<>();
orders.put(30L, order30);
orders.put(10L, order10);
orders.put(20L, order20);

System.out.println(orders.keySet()); // [30, 10, 20]
```

Replacing the value for an existing key does not normally make it a newly inserted key at the end of insertion order.

### Access order

A constructor with `accessOrder = true` orders entries by access rather than first insertion:

```java
Map<Long, Order> recent = new LinkedHashMap<>(16, 0.75f, true);
recent.put(1L, order1);
recent.put(2L, order2);
recent.put(3L, order3);

recent.get(1L);
System.out.println(recent.keySet()); // [2, 3, 1]
```

That mode is a useful building block for some cache/LRU patterns, although production caches also need explicit eviction, concurrency, and memory policies. `LinkedHashMap` supplies the ordering mechanism, not an entire cache design.

In Java 21, `LinkedHashMap` implements `SequencedMap`. Callers can work with first/last entries, explicit positioning, and reversed views without first materializing a list of keys. Encounter order becomes an explicit type capability.
