`EnumSet<E extends Enum<E>>` is a `Set` specialized for elements of **one enum type**. The JDK describes its internal representation as a bit vector, allowing each enum constant to map compactly to a bit position.

```java
EnumSet<OrderStatus> active = EnumSet.of(
        OrderStatus.NEW,
        OrderStatus.PAID,
        OrderStatus.PACKING
);

boolean needsWork = active.contains(OrderStatus.PAID);
```

Its factories make domain intent explicit:

```java
EnumSet<OrderStatus> none = EnumSet.noneOf(OrderStatus.class);
EnumSet<OrderStatus> all = EnumSet.allOf(OrderStatus.class);
EnumSet<OrderStatus> shippingFlow =
        EnumSet.range(OrderStatus.PAID, OrderStatus.SHIPPED);
EnumSet<OrderStatus> inactive = EnumSet.complementOf(active);
```

`EnumSet` iterates in the enum's **natural order**, meaning declaration order rather than insertion order. It rejects `null` elements and is not synchronized.

A defined iteration order does not imply Java 21 `SequencedSet`: `EnumSet` has its own declaration-order iteration contract but does not implement `SequencedSet`. Do not infer first/last/reversed sequenced APIs merely from the fact that a collection has stable iteration order.

Its iterators are **weakly consistent**: they do not throw `ConcurrentModificationException` and may or may not reflect modifications made after iterator creation. This iterator contract is different from the fail-fast behavior described for collections such as `ArrayList`.

Because the enum universe is finite and known, `EnumSet` is a strong fit for flag/capability/status groups. If the business requires arbitrary insertion order, `LinkedHashSet` has the more appropriate contract.
