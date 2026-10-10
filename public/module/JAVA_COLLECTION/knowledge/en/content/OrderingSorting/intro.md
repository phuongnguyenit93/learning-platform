# Ordering, Comparison, and Navigation

A collection often has to answer more than “which elements are present?” It may also need to answer “in what order are those elements observed?”. That order can come from the data structure, from the elements' natural ordering, or from a comparison rule supplied by the caller. These sources are related, but they are not the same thing.

The examples below reuse a small `Order` dataset:

```java
record Order(long id, long userId, int totalCents) {}

List<Order> orders = new ArrayList<>(List.of(
        new Order(3, 2, 10_000),
        new Order(1, 1, 20_000),
        new Order(2, 3, 10_000)
));
```
