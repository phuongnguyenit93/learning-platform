`TreeMap` keeps mappings in **sorted key order**.

```java
Map<Long, Order> orders = new TreeMap<>();
orders.put(30L, order30);
orders.put(10L, order10);
orders.put(20L, order20);

System.out.println(orders.keySet()); // [10, 20, 30]
```

Keys are ordered by their natural ordering or by a `Comparator` supplied to the constructor.

```java
record UserKey(long id, String region) {}

Map<UserKey, User> users = new TreeMap<>(
        Comparator.comparing(UserKey::region)
                  .thenComparingLong(UserKey::id)
);
```

As with `TreeSet`, a comparison result of zero means two keys occupy the same logical map position. If the comparator ignores an important field, putting a second key can replace the value associated with the first.

For a sorted map, it is therefore strongly preferable that the ordering be **consistent with `equals`**. A `TreeMap` whose ordering treats two unequal keys as comparison-equal still has defined behavior, but it no longer cleanly follows the general `Map` equality contract because key equivalence inside the tree is being decided by comparison rather than by `equals`.

`TreeMap` typically provides O(log n) `get`, `put`, and `remove` operations in exchange for navigable operations such as `firstEntry`, `lastEntry`, `lowerEntry`, `floorEntry`, `ceilingEntry`, and `higherEntry`.

With ordinary natural ordering, `TreeMap` does not accept a null key because it cannot be compared under that contract. Null values are allowed. A custom comparator can define null-key handling, but doing so should be an explicit API decision.

In Java 21, the sorted-map hierarchy also participates in `SequencedMap`, so first/last/reversed semantics have a common interface. The reason to choose `TreeMap` remains **sorted lookup and navigation by key**.
