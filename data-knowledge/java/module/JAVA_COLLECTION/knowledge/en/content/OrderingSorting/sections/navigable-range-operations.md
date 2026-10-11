Once the learner understands `Set`, `Map`, and ordering, the `NavigableSet`/`NavigableMap` APIs become much easier to reason about.

```java
NavigableSet<Integer> ids = new TreeSet<>(List.of(10, 20, 30, 40));

System.out.println(ids.lower(20));   // 10: < 20
System.out.println(ids.floor(25));   // 20: <= 25
System.out.println(ids.ceiling(25)); // 30: >= 25
System.out.println(ids.higher(30));  // 40: > 30
```

Range views expose a portion of sorted data without copying the whole structure:

```java
NavigableSet<Integer> middle = ids.subSet(20, true, 40, false); // [20, 30]
NavigableSet<Integer> head = ids.headSet(30, true);              // <= 30
NavigableSet<Integer> tail = ids.tailSet(20, false);             // > 20
```

These results are **backed views**. Supported mutation through the view affects the source, and source changes may be observed through the view according to its contract.

The `Map` branch applies the same mental model to **keys**:

```java
NavigableMap<Long, Order> byId = new TreeMap<>();
byId.put(10L, orderA);
byId.put(20L, orderB);
byId.put(30L, orderC);

Map.Entry<Long, Order> floor = byId.floorEntry(25L); // key 20
NavigableMap<Long, Order> firstTwo =
        byId.subMap(10L, true, 30L, false);           // keys 10, 20
```

`lower/floor/ceiling/higher` answer “which neighboring element/key is closest on this side?”, while `subSet/subMap/head*/tail*` create range views. This is why sorted/navigable structures are useful when the problem needs order-based navigation, not merely output that “looks sorted”.
