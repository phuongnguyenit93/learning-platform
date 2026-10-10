The priority queue returns the element according to the comparator/natural order, but has two footguns:

```text
Equal Priority
→ should not default to FIFO

High-priority item to continuously
→ low-priority item may have to wait a long time
```

This is **Business Scheduling Semantics**, not just the implementation detail.

References:

```text
CoordinationController#priorityQueueSemantics()
GET /coordination/priority-queue-semantics
```

The experiment creates a high-priority task and two tasks with the same priority. The output returns the observed order but at the same time specifies:

```text
higherPriorityComesFirst = true
equalPriorityFifoIsContract = false
boundedCapacityBackpressure = false
```

**Final Thoughts** if FIFO is required in the same priority, include the sequence in the ordering rule instead of relying on the implicit insertion order.
