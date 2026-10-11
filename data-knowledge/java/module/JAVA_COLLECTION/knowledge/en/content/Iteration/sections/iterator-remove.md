A common mistake is removing directly from a collection inside enhanced for:

```java
for (Order order : orders) {
    if (order.totalCents() == 0) {
        orders.remove(order); // may invalidate the iterator used by the loop
    }
}
```

When the iterator supports removal, remove through that iterator:

```java
Iterator<Order> it = orders.iterator();

while (it.hasNext()) {
    Order order = it.next();
    if (order.totalCents() == 0) {
        it.remove();
    }
}
```

`Iterator.remove()` removes the last element returned by `next()`. Two contract details matter:

1. `remove()` is optional; an iterator from an unmodifiable collection or an implementation without removal support may throw `UnsupportedOperationException`;
2. calling `remove()` before `next()`, or twice for the same `next()` result, throws `IllegalStateException`.

For example:

```java
Iterator<Order> it = orders.iterator();

Order first = it.next();
it.remove(); // valid if removal is supported

// it.remove(); // IllegalStateException: no new next() call
```

When the intent is simply to filter a mutable collection by a predicate, `removeIf` is often more direct:

```java
orders.removeIf(order -> order.totalCents() == 0);
```

Understanding `Iterator.remove()` is still valuable because it shows how mutation can be coordinated with traversal. Fail-fast behavior and structural-modification rules are covered in the later dedicated chapter.
