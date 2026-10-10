If the current element needs to be removed during traversal, use the mutation operation supported by the iterator:

```java
List<Order> orders = new ArrayList<>(List.of(
        new Order(1, 1, 20_000),
        new Order(2, 2, 0),
        new Order(3, 3, 15_000)
));

Iterator<Order> iterator = orders.iterator();
while (iterator.hasNext()) {
    Order order = iterator.next();
    if (order.totalCents() == 0) {
        iterator.remove();
    }
}
```

`Iterator.remove()` ties the mutation to the current traversal state. Normally `next()` must be called first, and `remove()` cannot be called twice for the same element without another successful `next()`.

When the intent is simply “remove everything matching this predicate”, a higher-level API is clearer:

```java
orders.removeIf(order -> order.totalCents() == 0);
```

`ListIterator` has its own supported mutation operations such as `add`, `remove`, and `set`. For maps, code can iterate over `entrySet().iterator()` and call `iterator.remove()`.

The common rule is that mutation must go through a mechanism supported by the traversal protocol. If the requirement is “one thread iterates while another thread mutates”, that is a concurrent-collection/synchronization problem rather than a trick for avoiding CME.
