`LinkedList` uses doubly linked nodes. Each node stores an element plus links to its predecessor and successor.

```text
null ← [A] ⇄ [B] ⇄ [C] → null
```

That representation makes operations at either end natural:

```java
Deque<Order> pending = new LinkedList<>();
pending.addFirst(urgentOrder);
pending.addLast(normalOrder);
```

If the implementation already has the relevant internal node, linking or unlinking it is constant-time. But the `List` API does not expose nodes to callers. To perform `get(5000)` or `add(5000, value)`, `LinkedList` must walk nodes from an end until it reaches that position, so locating the position is O(n).

```java
Order order = linkedOrders.get(5000); // traverses to the position
```

Memory usage also differs: each element needs a node with links, while `ArrayList` primarily keeps references inside an array.

For that reason, “`LinkedList` is faster for insertions and removals” is too broad. It can be effective at the ends or when an iterator is already positioned appropriately; it does not automatically win for index-based insertion because the node still has to be found.

For a pure double-ended queue or stack use case, `ArrayDeque` is commonly a clearer modern choice. `LinkedList` remains useful when the program truly needs the `List` contract together with end operations, but it should be chosen from the actual workload.
