A type has a **natural ordering** when the type itself defines how its instances are compared, usually through `Comparable<T>` and `compareTo`. A natural ordering should normally represent a stable, intrinsic ordering for the type rather than a temporary sort criterion for one screen or report.

For example, if `Order` uses `id` as its natural order:

```java
record Order(long id, long userId, int totalCents)
        implements Comparable<Order> {

    @Override
    public int compareTo(Order other) {
        return Long.compare(this.id, other.id);
    }
}

List<Order> orders = new ArrayList<>(List.of(
        new Order(3, 2, 10_000),
        new Order(1, 1, 20_000),
        new Order(2, 3, 10_000)
));

orders.sort(null); // null => use natural ordering
```

Natural ordering is also the default for structures such as `TreeSet`, `TreeMap`, and `PriorityQueue` when no explicit `Comparator` is supplied.

As a practical rule, `compareTo` should define a consistent and transitive relation. In sorted sets and maps, a natural ordering that is inconsistent with `equals` can make the collection's idea of “the same element/key” differ from equality-based intuition. The collection consequence is covered in the Equality/Hashing chapter; the `equals/hashCode` contract itself belongs to the `object-contract` module.
