`Iterator<E>` represents a logical cursor moving through a sequence of elements:

```java
Iterator<Order> iterator = orders.iterator();

while (iterator.hasNext()) {
    Order order = iterator.next();
    System.out.println(order.id());
}
```

Its core operations are:

- `hasNext()` asks whether another element exists;
- `next()` returns the next element and advances the cursor;
- `remove()` is an **optional operation**, available only when the specific iterator supports it.

Calling `next()` after the iterator is exhausted throws `NoSuchElementException`. Callers should not use that exception as the normal loop condition; the standard pattern checks `hasNext()` first.

An iterator does not promise one universal ordering. Its encounter order comes from the source collection:

- `ArrayList` iterates in list order;
- `LinkedHashSet` iterates in its defined encounter order;
- `TreeSet` iterates in sorted order;
- `HashSet` promises no particular encounter order;
- a `PriorityQueue` iterator does not promise priority-sorted order.

That separation lets algorithms depend on an interface while preserving source semantics:

```java
void printOrders(Iterable<Order> source) {
    Iterator<Order> it = source.iterator();
    while (it.hasNext()) {
        System.out.println(it.next());
    }
}
```

Iterators are normally stateful and represent one forward traversal. To traverse again, obtain a new iterator from the collection.

Directly changing a collection's structure while an iterator is active may invalidate iterator assumptions and can trigger fail-fast behavior in many ordinary collections. The Fail-Fast chapter owns the details of `ConcurrentModificationException`; the key point here is that mutation during traversal must follow the iterator/collection contract.
