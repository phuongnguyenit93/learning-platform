`List.copyOf`, `Set.copyOf`, and `Map.copyOf` accept existing data and return an unmodifiable result representing the **contents at copy time**.

```java
List<Order> source = new ArrayList<>();
source.add(new Order(1, 1, 20_000));

List<Order> snapshot = List.copyOf(source);

source.add(new Order(2, 2, 10_000));

System.out.println(source.size());   // 2
System.out.println(snapshot.size()); // 1
```

The `copyOf` methods may reuse an existing instance when the input is already an appropriate unmodifiable collection. Callers should not depend on object identity; depend on contents and mutation semantics instead.

This is still a **shallow copy**: element references are copied, but the element objects are not cloned. If a mutable element changes through another reference, the snapshot observes the new state of that same object.

`copyOf` also has important input contracts:

- `List.copyOf` / `Set.copyOf` reject `null` elements;
- `Map.copyOf` rejects `null` keys and `null` values;
- `List.copyOf` preserves the source collection's iteration order in the resulting list;
- `Set.copyOf` and `Map.copyOf` **do not promise to preserve the encounter order** of a source `LinkedHashSet` or `LinkedHashMap`.

So `copyOf` is a snapshot of **contents**, but callers should not assume that every observable property of the source implementation, such as insertion order, is also snapshotted.

A useful detail is that `Set.copyOf(collection)` can accept a source containing equal elements and retain one representative; this differs from `Set.of(a, b, ...)`, where duplicate arguments are rejected.
