`Deque<E>` means **double-ended queue**: elements can be added, examined, and removed at both ends.

```text
             Deque
     first ← [A][B][C] → last
             ↑       ↑
          operate   operate
          here      here
```

```java
Deque<Order> pending = new ArrayDeque<>();

pending.offerLast(normalOrder);
pending.offerFirst(urgentOrder);

Order first = pending.pollFirst();
Order last = pending.pollLast();
```

One contract can represent two common patterns.

### FIFO queue

```java
Deque<Order> queue = new ArrayDeque<>();
queue.offerLast(orderA);
queue.offerLast(orderB);

Order next = queue.pollFirst();
```

### LIFO stack

```java
Deque<Order> stack = new ArrayDeque<>();
stack.push(orderA);
stack.push(orderB);

Order latest = stack.pop(); // orderB
```

For new code, `Deque`/`ArrayDeque` is generally preferred to the legacy `Stack` class because the two-ended contract is explicit and does not inherit the older `Vector` design.

Since Java 21, `Deque` also extends `SequencedCollection`. That matches its defined first/last semantics and gives it the common sequenced vocabulary, including reversed views, alongside the specialized `Deque` methods.

Do not assume every `Deque` implementation has identical costs. `ArrayDeque` uses a resizable circular-array style representation; `LinkedList` uses linked nodes. Choose based on the workload and required characteristics, even when both satisfy the same interface.
