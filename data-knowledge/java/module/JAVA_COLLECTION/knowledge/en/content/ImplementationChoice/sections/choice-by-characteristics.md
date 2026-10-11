A practical selection process is:

1. Choose the abstraction: `List`, `Set`, `Map`, or `Queue/Deque`.
2. Define uniqueness/key semantics and required ordering.
3. Identify hot operations: random access, membership lookup, range query, endpoint operations, priority removal, and so on.
4. Define the mutation model: fully modifiable, fixed-size/backed, unmodifiable view, or independent snapshot.
5. Check null policy and factory restrictions. For example, `List.of`/`Set.of`/`Map.of` and the `copyOf` families reject nulls; `Set.of` rejects duplicate arguments and `Map.of` rejects duplicate keys.
6. Account for memory overhead and expected data size. Linked nodes, linked encounter-order metadata, tree nodes, and spare array capacity all have different costs; Big-O alone does not describe that footprint.
7. Look for domain-specific specialization before settling on a general-purpose structure. If elements or keys come from one enum type, `EnumSet` or `EnumMap` may express the domain more precisely.
8. Benchmark only when performance is actually a concern; do not turn Big-O into guesses about micro-performance.

Using the same `Order` domain:

```text
preserve input order and allow duplicates
→ ArrayList<Order>

unique order ids, order does not matter
→ HashSet<Long>

lookup Order by id
→ HashMap<Long, Order>

lookup by id and traverse in insertion order
→ LinkedHashMap<Long, Order>

process Orders by priority
→ PriorityQueue<Order>
```

These checks can change the choice even when two implementations satisfy the same interface. A collection with the right asymptotic cost may still be wrong if it permits mutation that an API should prevent, rejects a required null, loses an ordering guarantee, violates a factory restriction, or carries unnecessary structural overhead for the workload.

Prefer returning the interface that represents the API contract, such as `List<Order>` instead of forcing callers to depend on `ArrayList<Order>`, unless implementation-specific behavior is intentionally part of that contract.

The next chapter completes this milestone with `EnumSet` and `EnumMap`. Their specialized representation is useful when the domain is an enum universe, but the primary reason to choose them is that their type and ordering contracts match that domain.

Thread safety is another selection dimension, but it should not be solved by casually swapping collection implementations in this chapter. Shared mutable data requires ownership, synchronization, and concurrent-collection reasoning from the corresponding concurrency material.
