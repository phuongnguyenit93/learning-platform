`Queue<E>` models a structure whose primary operations are **inserting an element** and **examining/removing the head for processing**. In an ordinary FIFO queue, first in means first out:

```text
offer A → [A]
offer B → [A, B]
offer C → [A, B, C]
poll    → A
poll    → B
```

```java
Queue<Order> pending = new ArrayDeque<>();
pending.offer(orderA);
pending.offer(orderB);
pending.offer(orderC);

Order next = pending.poll(); // orderA
```

FIFO is the common model, but `Queue` does not require every implementation to use insertion order. `PriorityQueue` is the important counterexample: its head is determined by priority ordering.

When an API accepts `Queue<Order>`, callers can rely on queue operations such as `offer`, `poll`, and `peek`. The exact removal order depends on the selected queue implementation.

For an ordinary processing queue, `ArrayDeque` is often a strong implementation: it has efficient end operations, grows as needed in normal use, and rejects null elements.

Avoid null elements in queues even where a particular implementation may permit them, because `poll` and `peek` use null as the special result for an empty queue. Keeping “real data” separate from “no element” makes the API easier to reason about.
