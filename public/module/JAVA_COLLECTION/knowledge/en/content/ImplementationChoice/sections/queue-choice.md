For FIFO/LIFO behavior or operations at both ends, `ArrayDeque` is usually the general-purpose choice:

- efficient insertion/removal at both ends;
- queue behavior through `offerLast/pollFirst`;
- stack behavior through `push/pop`;
- `null` elements are not permitted.

`LinkedList` also implements both `Deque` and `List`. It is appropriate when the linked-list contract/behavior itself is useful; using it only because a queue is needed generally offers no clear advantage over `ArrayDeque` and adds node overhead.

`PriorityQueue` solves a different problem: it exposes the element with the **highest priority according to its ordering** at the head (the least element under the comparator, unless the comparator is reversed).

```java
PriorityQueue<Order> queue = new PriorityQueue<>(
        Comparator.comparingInt(Order::totalCents).reversed()
);

queue.offer(new Order(1, 1, 20_000));
queue.offer(new Order(2, 2, 10_000));

System.out.println(queue.peek().id()); // 1
```

A `PriorityQueue` iterator is **not guaranteed** to return all elements in priority order. Repeated `poll()` operations are required to consume them by priority. Elements with equal priority also have no stable ordering guarantee by default.
