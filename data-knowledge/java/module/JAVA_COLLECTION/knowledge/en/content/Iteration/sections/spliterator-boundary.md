`Spliterator<E>` can be viewed as a traversal abstraction that extends the iterator idea with two capabilities:

1. visit elements;
2. attempt to partition the source into pieces that can be processed independently.

```java
Spliterator<Order> spliterator = orders.spliterator();

spliterator.tryAdvance(order ->
        System.out.println(order.id())
);
```

`tryAdvance` processes one element when available and returns whether it succeeded. `forEachRemaining` consumes the remainder.

The distinctive operation is `trySplit()`:

```java
Spliterator<Order> left = orders.spliterator();
Spliterator<Order> right = left.trySplit();
```

An implementation may return another spliterator representing part of the data, or `null` when it cannot or chooses not to split further. Do not assume every source partitions evenly or efficiently.

A spliterator also reports **characteristics** that help consumers understand the source, for example:

- `ORDERED` — a defined encounter order exists;
- `DISTINCT` — elements are distinct under the source contract;
- `SORTED` — the source has sorted order;
- `SIZED` — the exact size is known;
- `SUBSIZED` — split parts also satisfy the relevant sizing contract.

```java
boolean ordered = spliterator.hasCharacteristics(Spliterator.ORDERED);
long estimate = spliterator.estimateSize();
```

The important boundary in this chapter is its relationship to Stream:

```text
Collection
    ↓ spliterator()
Spliterator
    ↓ traversal + splitting + source characteristics
Stream pipeline
```

`Collection.stream()` and `parallelStream()` use a spliterator as a traversal source. A `Spliterator` provides a foundation for partitioning data, but it does **not** by itself make traversal parallel or make a collection thread-safe. Stream execution, parallelism, and concurrency belong to their own topics.

For the Collection module, keep this distinction: `Iterator` is optimized for sequential element-by-element traversal; `Spliterator` enriches traversal with source information and partitioning support for higher-level consumers such as Stream.
