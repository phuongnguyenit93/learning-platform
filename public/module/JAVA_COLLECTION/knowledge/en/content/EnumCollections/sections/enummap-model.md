`EnumMap<K extends Enum<K>, V>` is a `Map` specialized for enum keys. The JDK uses an array-oriented internal representation, taking advantage of the enum key space instead of a general-purpose hash-bucket structure.

```java
EnumMap<OrderStatus, Integer> counts =
        new EnumMap<>(OrderStatus.class);

counts.put(OrderStatus.NEW, 5);
counts.put(OrderStatus.PAID, 12);
counts.put(OrderStatus.SHIPPED, 8);

System.out.println(counts.get(OrderStatus.PAID)); // 12
```

Keys are iterated in enum declaration order, giving a stable and predictable encounter order:

```java
for (var entry : counts.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}
```

`EnumMap` rejects `null` keys but permits `null` values. If null values are stored, `get(key) == null` cannot distinguish “no mapping” from “mapping to null”; use `containsKey` when that distinction matters.

Like `EnumSet`, `EnumMap` has a defined encounter order but does not implement `SequencedMap`. `SequencedMap` standardizes first/last/reversed behavior for maps that implement that interface; it is not a prerequisite for a map to have a defined order.

Its collection-view iterators are also **weakly consistent**: they do not throw `ConcurrentModificationException` and may or may not show modifications made after iterator creation. `EnumMap` itself is not synchronized.
